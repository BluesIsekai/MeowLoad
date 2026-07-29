use std::fs::{self, File};
use std::io::{self, Read, Write};
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Emitter, Manager};
use futures_util::StreamExt;

#[derive(Clone, serde::Serialize)]
pub struct DownloadProgress {
    pub binary_name: String,
    pub downloaded_bytes: u64,
    pub total_bytes: u64,
}

/// Resolves or creates the local `bin/` path inside application data directory
pub fn get_binaries_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("bin");

    if !dir.exists() {
        fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    }
    Ok(dir)
}

/// Downloads a binary or zip file directly from a URL to the local binary folder
pub async fn download_file(
    app: &AppHandle,
    url: &str,
    target_filename: &str,
) -> Result<PathBuf, String> {
    let bin_dir = get_binaries_dir(app)?;
    let target_path = bin_dir.join(target_filename);

    if target_path.exists() {
        return Ok(target_path);
    }

    let client = reqwest::Client::new();
    let res = client
        .get(url)
        .header("User-Agent", "MeowLoad-Downloader")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let total_size = res.content_length().unwrap_or(0);
    let mut file = File::create(&target_path).map_err(|e| e.to_string())?;
    let mut downloaded: u64 = 0;
    let mut stream = res.bytes_stream();

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;

        let _ = app.emit(
            "binary_download_progress",
            DownloadProgress {
                binary_name: target_filename.to_string(),
                downloaded_bytes: downloaded,
                total_bytes: total_size,
            },
        );
    }

    // Grant execution permissions on Unix/Linux/macOS platforms
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(&target_path).map_err(|e| e.to_string())?.permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&target_path, perms).map_err(|e| e.to_string())?;
    }

    Ok(target_path)
}

/// Unzips ffmpeg.exe and ffprobe.exe from a downloaded .zip archive (Windows)
pub fn extract_ffmpeg_zip(archive_path: &Path, target_dir: &Path) -> Result<(), String> {
    let zip_file = File::open(archive_path).map_err(|e| e.to_string())?;
    let mut archive = zip::ZipArchive::new(zip_file).map_err(|e| e.to_string())?;

    for i in 0..archive.len() {
        let mut entry = archive.by_index(i).map_err(|e| e.to_string())?;
        let outpath = match entry.enclosed_name() {
            Some(path) => path.to_owned(),
            None => continue,
        };

        if let Some(filename) = outpath.file_name() {
            let filename_str = filename.to_string_lossy();
            if filename_str == "ffmpeg.exe" || filename_str == "ffprobe.exe" {
                let dest_path = target_dir.join(filename);
                let mut outfile = File::create(&dest_path).map_err(|e| e.to_string())?;
                io::copy(&mut entry, &mut outfile).map_err(|e| e.to_string())?;
            }
        }
    }

    // Clean up downloaded zip archive
    let _ = fs::remove_file(archive_path);
    Ok(())
}