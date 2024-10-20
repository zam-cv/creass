use anyhow::Result;
use mistralrs::{
    IsqType, Model, PagedAttentionMetaBuilder, TextMessageRole, TextMessages, TextModelBuilder,
};
use once_cell::sync::OnceCell;
use std::sync::Arc;
use tokio::sync::Mutex as TokioMutex;

static MODEL: OnceCell<Arc<TokioMutex<Model>>> = OnceCell::new();
static RUNTIME: OnceCell<tokio::runtime::Runtime> = OnceCell::new();

fn get_runtime() -> &'static tokio::runtime::Runtime {
    RUNTIME.get_or_init(|| tokio::runtime::Runtime::new().expect("Failed to create Tokio runtime"))
}

async fn get_or_initialize_model() -> Result<Arc<TokioMutex<Model>>> {
    if let Some(model) = MODEL.get() {
        Ok(model.clone())
    } else {
        let model = TextModelBuilder::new("microsoft/Phi-3.5-mini-instruct".to_string())
            .with_isq(IsqType::Q8_0)
            .with_logging()
            .with_paged_attn(|| PagedAttentionMetaBuilder::default().build())?
            .build()
            .await?;

        let model = Arc::new(TokioMutex::new(model));
        // Usamos get_or_init para asegurarnos de que solo un hilo inicialice el modelo
        Ok(MODEL.get_or_init(|| model).clone())
    }
}

#[tauri::command]
fn query_model(prompt: String) -> Result<String, String> {
    get_runtime().block_on(async {
        let model = get_or_initialize_model().await.map_err(|e| e.to_string())?;

        let messages = TextMessages::new()
            .add_message(
                TextMessageRole::System,
                "You are an AI agent with a specialty in programming.",
            )
            .add_message(TextMessageRole::User, prompt);

        let model_guard = model.lock().await;
        let response = model_guard
            .send_chat_request(messages)
            .await
            .map_err(|e| e.to_string())?;

        Ok(response.choices[0]
            .message
            .content
            .clone()
            .unwrap_or_default())
    })
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, query_model])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
