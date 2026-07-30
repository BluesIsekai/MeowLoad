use futures_util::StreamExt;
use std::fs::{self, File};
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use tauri::{AppHandle, Emitter, Manager};

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

/// Downloads a binary or file directly from a URL to the local binary folder
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
        let mut perms = fs::metadata(&target_path)
            .map_err(|e| e.to_string())?
            .permissions();
        perms.set_mode(0o755);
        fs::set_permissions(&target_path, perms).map_err(|e| e.to_string())?;
    }

    Ok(target_path)
}

/// Unzips ffmpeg.exe and ffprobe.exe from a .zip archive (Windows)
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

    let _ = fs::remove_file(archive_path);
    Ok(())
}

/// Extracts ffmpeg binary from a .tar.xz archive (Linux)
pub fn extract_ffmpeg_tar_xz(archive_path: &Path, target_dir: &Path) -> Result<(), String> {
    let tar_file = File::open(archive_path).map_err(|e| e.to_string())?;
    let xz_decoder = xz2::read::XzDecoder::new(tar_file);
    let mut archive = tar::Archive::new(xz_decoder);

    if let Ok(entries) = archive.entries() {
        for entry in entries.flatten() {
            if let Ok(path) = entry.path() {
                if let Some(filename) = path.file_name() {
                    let name_str = filename.to_string_lossy();
                    if name_str == "ffmpeg" || name_str == "ffprobe" {
                        let dest_path = target_dir.join(filename);
                        let mut outfile = File::create(&dest_path).map_err(|e| e.to_string())?;
                        let mut entry_file = entry;
                        io::copy(&mut entry_file, &mut outfile).map_err(|e| e.to_string())?;

                        #[cfg(unix)]
                        {
                            use std::os::unix::fs::PermissionsExt;
                            if let Ok(meta) = fs::metadata(&dest_path) {
                                let mut perms = meta.permissions();
                                perms.set_mode(0o755);
                                let _ = fs::set_permissions(&dest_path, perms);
                            }
                        }
                    }
                }
            }
        }
    }

    let _ = fs::remove_file(archive_path);
    Ok(())
}