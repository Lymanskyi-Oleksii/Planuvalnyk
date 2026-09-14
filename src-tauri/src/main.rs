// Ховаємо консольне вікно на Windows у релізній збірці
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Відомий баг WebView2 на Windows: вікно чорніє після згортання/розгортання
    // через апаратне прискорення GPU. Вимикаємо його для вебв'ю — це усуває проблему.
    #[cfg(target_os = "windows")]
    std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--disable-gpu");

    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("помилка під час запуску Планувальника");
}
