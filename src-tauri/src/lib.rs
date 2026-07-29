mod bin_manager;
mod commands;

use commands::DownloadManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(DownloadManager::new())
        .invoke_handler(tauri::generate_handler![
            commands::check_and_prepare_binaries,
            commands::get_media_info,
            commands::start_download,
            commands::cancel_download,
            commands::open_file_location,
        ])
        .run(tauri::generate_context!())
        .expect("error while running MeowLoad application");
}