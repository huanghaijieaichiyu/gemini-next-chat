// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Manager};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
