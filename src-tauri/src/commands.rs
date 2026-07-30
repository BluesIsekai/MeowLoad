use crate::bin_manager::{self, get_binaries_dir};
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::process::Stdio;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{Child, Command};
use tokio::sync::Mutex;

#[derive(Clone, Serialize)]
pub struct DownloadProgressPayload {
    pub id: String,
    pub percentage: f32,
    pub speed: String,
    pub eta: String,
    pub status: String, // "downloading" | "finished" | "error"
}

pub struct DownloadManager {
    pub processes: Arc<Mutex<HashMap<String, Child>>>,
}

impl DownloadManager {
    pub fn new() -> Self {
        Self {
            processes: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[tauri::command]
pub async fn check_and_prepare_binaries(app: AppHandle) -> Result<bool, String> {
    let target_os = std::env::consts::OS;

    let (ytdlp_url, ytdlp_name) = match target_os {
        "windows" => (
            "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe",
            "yt-dlp.exe",
        ),
        "macos" => (
            "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos",
            "yt-dlp",
        ),
        "linux" => (
            "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp",
            "yt-dlp",
        ),
        _ => return Err("Unsupported Operating System".into()),
    };

    // 1. Download yt-dlp binary if missing
    bin_manager::download_file(&app, ytdlp_url, ytdlp_name).await?;

    // 2. Resolve or preparation for FFmpeg
    let bin_dir = get_binaries_dir(&app)?;
    let ffmpeg_exe = if cfg!(target_os = "windows") { "ffmpeg.exe" } else { "ffmpeg" };

    // Check if system ffmpeg exists on Linux/macOS before downloading
    if !bin_dir.join(ffmpeg_exe).exists() {
        if target_os == "windows" {
            let ffmpeg_url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";
            let zip_path = bin_manager::download_file(&app, ffmpeg_url, "ffmpeg.zip").await?;
            bin_manager::extract_ffmpeg_zip(&zip_path, &bin_dir)?;
        } else if target_os == "linux" {
            // Check if user has system ffmpeg installed via pacman/apt first
            if std::process::Command::new("ffmpeg").arg("-version").output().is_err() {
                // Download static Linux x86_64 FFmpeg binary tarball
                let ffmpeg_url = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
                let tar_path = bin_manager::download_file(&app, ffmpeg_url, "ffmpeg.tar.xz").await?;
                // Extract static binary
                bin_manager::extract_ffmpeg_tar_xz(&tar_path, &bin_dir)?;
            }
        }
    }

    Ok(true)
}

#[tauri::command]
pub async fn get_media_info(app: AppHandle, url: String) -> Result<Value, String> {
    let bin_dir = get_binaries_dir(&app)?;
    let ytdlp_name = if cfg!(target_os = "windows") { "yt-dlp.exe" } else { "yt-dlp" };
    let ytdlp_path = bin_dir.join(ytdlp_name);

    let output = Command::new(ytdlp_path)
        .args(["--dump-json", "--no-playlist", &url])
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    let stdout_str = String::from_utf8_lossy(&output.stdout);
    let json_data: Value = serde_json::from_str(&stdout_str).map_err(|e| e.to_string())?;

    Ok(json_data)
}

#[tauri::command]
pub async fn start_download(
    app: AppHandle,
    id: String,
    url: String,
    format_id: String,
    output_dir: String,
    container: String,
    state: State<'_, DownloadManager>,
) -> Result<(), String> {
    let bin_dir = get_binaries_dir(&app)?;
    let ytdlp_name = if cfg!(target_os = "windows") { "yt-dlp.exe" } else { "yt-dlp" };
    let ytdlp_path = bin_dir.join(ytdlp_name);

    // 1. Robust multi-level path resolution for Linux/Windows
    let safe_dir = if !output_dir.trim().is_empty() {
        std::path::PathBuf::from(output_dir)
    } else {
        // Try Tauri path resolver first
        app.path().download_dir().unwrap_or_else(|_| {
            // Fallback: Build $HOME/Downloads directly on Linux/macOS
            if let Ok(home) = std::env::var("HOME") {
                let user_downloads = std::path::PathBuf::from(home).join("Downloads");
                if user_downloads.exists() {
                    return user_downloads;
                }
            }
            std::path::PathBuf::from("/tmp")
        })
    };

    // Ensure destination directory exists
    if !safe_dir.exists() {
        let _ = std::fs::create_dir_all(&safe_dir);
    }

    let target_container = if container.trim().is_empty() || container.contains('/') || container.contains('\\') {
        "mp4".to_string()
    } else {
        container.trim().to_lowercase()
    };

    let output_template = safe_dir.join("%(title)s.%(ext)s").to_string_lossy().to_string();

    println!("--------------------------------------------------");
    println!("🚀 [MeowLoad] Downloading to: {}", safe_dir.display());
    println!("--------------------------------------------------");

    // 2. Resolve FFmpeg
    let ffmpeg_name = if cfg!(target_os = "windows") { "ffmpeg.exe" } else { "ffmpeg" };
    let local_ffmpeg = bin_dir.join(ffmpeg_name);

    let mut args = vec![
        "-f".to_string(),
        if format_id.trim().is_empty() { "bestvideo+bestaudio/best".to_string() } else { format_id },
        "-o".to_string(),
        output_template,
        "--merge-output-format".to_string(),
        target_container,
        "--newline".to_string(),
        "--progress-template".to_string(),
        "download:MEOW_PROGRESS:%(progress.downloaded_bytes)s|%(progress.total_bytes,progress.total_bytes_estimate)s|%(progress.speed)s|%(progress.eta)s".to_string(),
    ];

    if local_ffmpeg.exists() {
        args.push("--ffmpeg-location".to_string());
        args.push(bin_dir.to_str().unwrap_or_default().to_string());
    }

    args.push(url);

    let mut cmd = Command::new(&ytdlp_path);
    cmd.args(&args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    let mut child = cmd.spawn().map_err(|e| e.to_string())?;
    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    let stderr = child.stderr.take();

    {
        let mut processes = state.processes.lock().await;
        processes.insert(id.clone(), child);
    }

    let download_id = id.clone();
    let processes_ref = state.processes.clone();

    tokio::spawn(async move {
        let mut reader = BufReader::new(stdout).lines();

        while let Ok(Some(line)) = reader.next_line().await {
            let line_str = line.trim();

            if line_str.starts_with("MEOW_PROGRESS:") {
                let clean_line = &line_str["MEOW_PROGRESS:".len()..];
                let parts: Vec<&str> = clean_line.split('|').collect();

                if parts.len() == 4 {
                    let downloaded: f32 = parts[0].parse().unwrap_or(0.0);
                    let total: f32 = parts[1].parse().unwrap_or(0.0);
                    let percentage = if total > 0.0 { (downloaded / total) * 100.0 } else { 0.0 };

                    let speed = if parts[2] != "NA" && !parts[2].is_empty() { parts[2].to_string() } else { "N/A".into() };
                    let eta = if parts[3] != "NA" && !parts[3].is_empty() { parts[3].to_string() } else { "--:--".into() };

                    let _ = app.emit(
                        "download_progress",
                        DownloadProgressPayload {
                            id: download_id.clone(),
                            percentage,
                            speed,
                            eta,
                            status: "downloading".into(),
                        },
                    );
                }
            } else if !line_str.is_empty() {
                println!("[yt-dlp]: {}", line_str);
            }
        }

        if let Some(err_stream) = stderr {
            let mut err_reader = BufReader::new(err_stream).lines();
            while let Ok(Some(err_line)) = err_reader.next_line().await {
                eprintln!("[yt-dlp stderr]: {}", err_line);
            }
        }

        {
            let mut processes = processes_ref.lock().await;
            processes.remove(&download_id);
        }

        let _ = app.emit(
            "download_progress",
            DownloadProgressPayload {
                id: download_id.clone(),
                percentage: 100.0,
                speed: "0B/s".into(),
                eta: "00:00".into(),
                status: "finished".into(),
            },
        );
    });

    Ok(())
}

#[tauri::command]
pub async fn cancel_download(
    id: String,
    state: State<'_, DownloadManager>,
) -> Result<bool, String> {
    let mut processes = state.processes.lock().await;

    if let Some(mut child) = processes.remove(&id) {
        let _ = child.kill().await;
        Ok(true)
    } else {
        Err("No active download found with that ID".into())
    }
}

#[tauri::command]
pub async fn open_file_location(app: AppHandle, path: String) -> Result<(), String> {
    // 1. Resolve target path gracefully
    let target_path = if path.trim().is_empty() {
        app.path()
            .download_dir()
            .unwrap_or_else(|_| {
                if let Ok(home) = std::env::var("HOME") {
                    std::path::PathBuf::from(home).join("Downloads")
                } else {
                    std::path::PathBuf::from("/tmp")
                }
            })
    } else {
        std::path::PathBuf::from(path)
    };

    // Ensure directory exists
    if !target_path.exists() {
        let _ = std::fs::create_dir_all(&target_path);
    }

    let path_str = target_path.to_string_lossy().to_string();

    // 2. Windows / macOS / Standard Desktop Linux (Tauri 2 Native Opener)
    #[cfg(not(target_os = "linux"))]
    {
        use tauri_plugin_opener::OpenerExt;
        app.opener()
            .open_path(&path_str, None::<&str>)
            .map_err(|e| e.to_string())?;
    }

    // 3. Linux Implementation
    #[cfg(target_os = "linux")]
    {
        use tauri_plugin_opener::OpenerExt;

        // Try Tauri's native opener plugin first (uses xdg-open internally)
        if app.opener().open_path(&path_str, None::<&str>).is_err() {
            // Fallback for minimal window manager setups (Hyprland / Sway / i3)
            let fallback_managers = ["xdg-open", "dolphin", "thunar", "nautilus", "pcmanfm", "nemo"];
            let mut launched = false;

            for cmd in fallback_managers {
                if std::process::Command::new(cmd)
                    .arg(&path_str)
                    .stdin(std::process::Stdio::null())
                    .stdout(std::process::Stdio::null())
                    .stderr(std::process::Stdio::null())
                    .spawn()
                    .is_ok()
                {
                    launched = true;
                    break;
                }
            }

            if !launched {
                return Err("Failed to open file location on Linux".into());
            }
        }
    }

    Ok(())
}