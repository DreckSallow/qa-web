use axum::{
    extract::{
        ws::{Message, WebSocket},
        Path, State, WebSocketUpgrade,
    },
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::get,
    Json, Router,
};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::{collections::HashMap, sync::Arc};
use tokio::sync::mpsc;

use crate::app_state::{AppState, AppStateT};

pub fn router() -> Router {
    Router::new()
        .route("/", get(index_route))
        .route("/threads", get(threads_count))
        .route("/thread/:thread_id", get(thread_route))
        .with_state(Arc::new(AppState::new()))
}
async fn index_route() -> Html<&'static str> {
    Html("<h1>Hello World</h1>")
}

async fn threads_count(State(state): State<AppStateT>) -> impl IntoResponse {
    let mut data = HashMap::new();
    for (k, v) in state.threads.read().await.iter() {
        data.insert(k.clone(), v.len());
    }
    Json(data)
}

async fn thread_route(
    ws: WebSocketUpgrade,
    Path(thread_id): Path<String>,
    State(app_state): State<AppStateT>,
) -> impl IntoResponse {
    tracing::debug!("Threads request: {}", thread_id);
    //TODO: check the discussion table for
    //security role: "public" | "only registers" | "nobody"
    let supabase_res = app_state
        .client
        .from("discussions")
        .eq("id", &thread_id)
        .select("id")
        .execute()
        .await;

    match supabase_res {
        Err(_e) => return (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
        Ok(res) => {
            if res.status() != 200 {
                return (res.status(), "Error getting the discussion").into_response();
            }
            ws.on_upgrade(|s| handle_socket(s, app_state, thread_id))
        }
    }
}

#[derive(Deserialize, Serialize)]
#[serde(tag = "type", content = "payload")]
enum WebMessage {
    Create { message: String },
    Update { likes: usize, id: String },
    Delete { id: String },
}

static NEXT_USERID: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(1);
async fn handle_socket(ws: WebSocket, state: AppStateT, thread_id: String) {
    let (mut sender, mut receiver) = ws.split();
    let (tx, mut rx) = mpsc::unbounded_channel::<String>();

    // Spawn a new task to listen messages
    tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            sender.send(Message::Text(msg)).await.unwrap();
        }
        sender.close().await.unwrap();
    });
    let index_client = NEXT_USERID.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    {
        //Add the new user to thread_id users
        let mut threads = state.threads.write().await;
        if let Some(v) = threads.get_mut(&thread_id) {
            v.insert(index_client, tx);
        } else {
            let mut new_hash = HashMap::new();
            new_hash.insert(index_client, tx);
            threads.insert(thread_id.clone(), new_hash);
        };
    }
    // Listen user messages
    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(msg_text) = msg {
            //TODO: Update the database and send the new message
            let client_message: WebMessage = match serde_json::from_str(&msg_text) {
                Err(e) => {
                    tracing::debug!("ERROR PARSING: {:?}", e);
                    continue;
                }
                Ok(r) => r,
            };

            let query_client = state.client.from("comments").select("message,id,likes");

            let (supabase_res, type_tag) = match client_message {
                WebMessage::Create { message } => {
                    let json = json!([{
                        "message":message,
                        "discussion_id":thread_id,
                        "likes":0
                    }])
                    .to_string();
                    (query_client.insert(json).execute().await, "Create")
                }
                WebMessage::Update { likes, id } => {
                    let json = json!([{"likes":likes}]).to_string();
                    (
                        query_client.eq("id", id).update(json).execute().await,
                        "Update",
                    )
                }
                WebMessage::Delete { id } => {
                    (query_client.eq("id", id).delete().execute().await, "Delete")
                }
            };
            match supabase_res {
                Err(e) => {
                    tracing::debug!("ERROR SUPABASE: {}", e);
                }
                Ok(res) => {
                    let st = res.status().as_u16();
                    if st >= 200 && st <= 299 {
                        if let Ok(cmm_str) = res.text().await {
                            if let Some(threads) = state.threads.read().await.get(&thread_id) {
                                for (_cid, thread) in threads {
                                    if let Err(e) = thread.send(
                                        json!({
                                            "type":type_tag,
                                            "payload":cmm_str.to_string()
                                        })
                                        .to_string(),
                                    ) {
                                        tracing::info!("ERROR SENDING MESSAGE: {:?}", e);
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    let mut threads = state.threads.write().await;
    if let Some(v) = threads.get_mut(&thread_id) {
        v.remove(&index_client);
    }
}
