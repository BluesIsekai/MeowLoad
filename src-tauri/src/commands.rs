use crate::bin_manager::{self, get_binaries_dir};
use serde::Serialize;
use serde_json::Value;
use std::collections::HashMap;
use std::process::Stdio;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, State};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{Child, Command};
use tokio::sync::Mutex;
use tauri_plugin_opener::OpenerExt;

#[derive(Clone, Serialize)]
pub struct DownloadProgressPayload {
    pub id: String,
    pub percentage: f32,
    pub speed: String,
    pub eta: String,
}

// Managed state to track running yt-dlp child processes by download ID
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

    // Ensure yt-dlp binary is downloaded
    bin_manager::download_file(&app, ytdlp_url, ytdlp_name).await?;

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
    state: State<'_, DownloadManager>,
) -> Result<(), String> {
    let bin_dir = get_binaries_dir(&app)?;
    
    // Resolve yt-dlp & ffmpeg paths
    let ytdlp_name = if cfg!(target_os = "windows") { "yt-dlp.exe" } else { "yt-dlp" };
    let ffmpeg_name = if cfg!(target_os = "windows") { "ffmpeg.exe" } else { "ffmpeg" };
    
    let ytdlp_path = bin_dir.join(ytdlp_name);
    let ffmpeg_path = bin_dir.join(ffmpeg_name);

    let output_template = format!("{}/%(title)s.%(ext)s", output_dir);

    let mut cmd = Command::new(&ytdlp_path);
    cmd.args([
        "-f", &format_id,
        "-o", &output_template,
        "--ffmpeg-location", ffmpeg_path.to_str().unwrap_or_default(),
        "--newline",
        "--progress-template", "%(progress.downloaded_bytes)s|%(progress.total_bytes)s|%(progress.speed)s|%(progress.eta)s",
        &url
    ])
    .stdout(Stdio::piped())
    .stderr(Stdio::piped());

    let mut child = cmd.spawn().map_err(|e| e.to_string())?;
    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;

    {
        let mut processes = state.processes.lock().await;
        processes.insert(id.clone(), child);
    }

    let download_id = id.clone();
    let processes_ref = state.processes.clone();

    // Stream lines in real-time and emit events back to React
    tokio::spawn(async move {
        let mut reader = BufReader::new(stdout).lines();

        while let Ok(Some(line)) = reader.next_line().await {
            let parts: Vec<&str> = line.trim().split('|').collect();
            if parts.len() == 4 {
                let downloaded: f32 = parts[0].parse().unwrap_or(0.0);
                let total: f32 = parts[1].parse().unwrap_or(1.0);
                let percentage = if total > 0.0 { (downloaded / total) * 100.0 } else { 0.0 };

                let _ = app.emit(
                    "download_progress",
                    DownloadProgressPayload {
                        id: download_id.clone(),
                        percentage,
                        speed: parts[2].to_string(),
                        eta: parts[3].to_string(),
                    },
                );
            }
        }

        // Clean up process handle from state once finished
        let mut processes = processes_ref.lock().await;
        processes.remove(&download_id);
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
        // Kill child process
        let _ = child.kill().await;
        Ok(true)
    } else {
        Err("No active download found with that ID".into())
    }
}



#[tauri::command]
pub async fn open_file_location(app: AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .open_path(path, None::<&str>)
        .map_err(|e| e.to_string())?;
    Ok(())
}