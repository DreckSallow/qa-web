use axum::{
    extract::{
        ws::{Message, WebSocket},
        Path, State, WebSocketUpgrade,
    },
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::get,
    Router,
};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::Arc;
use tokio::sync::mpsc;

use crate::{
    app_state::{AppState, AppStateT},
    Config,
};

pub fn router(config: Config) -> Router {
    Router::new()
        .route("/", get(index_route))
        // .route("/threads", get(threads_count))
        .route("/thread/:thread_id", get(thread_route))
        .with_state(Arc::new(AppState::new(
            &config.supabase_url,
            &config.supabase_key,
        )))
}
async fn index_route() -> Html<&'static str> {
    Html("<h1>Hello World</h1>")
}

// async fn threads_count(State(state): State<AppStateT>) -> impl IntoResponse {
//     Json(state.discussions.get_info().await)
// }

async fn thread_route(
    ws: WebSocketUpgrade,
    Path(thread_id): Path<String>,
    State(app_state): State<AppStateT>,
) -> impl IntoResponse {
    //TODO: Add role security for discussions table
    let supabase_res = app_state
        .client()
        .from("discussions")
        .eq("id", &thread_id)
        .select("id")
        .execute()
        .await;
    match supabase_res {
        Err(_e) => (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
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
    state
        .discussions
        .add_client(&thread_id, index_client, tx)
        .await;
    // Listen user messages
    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(msg_text) = msg {
            let client_message: WebMessage = match serde_json::from_str(&msg_text) {
                Err(_e) => {
                    state
                        .discussions
                        .send_on_by_id(
                            &thread_id,
                            &index_client,
                            json!({
                                "type":"Error",
                                "payload":"Bad message structure request."
                            })
                            .to_string(),
                        )
                        .await;
                    continue;
                }
                Ok(r) => r,
            };
            let query_client = state.client().from("comments").select("message,id,likes");

            let (supabase_res, type_tag) = match client_message {
                WebMessage::Create { message } => {
                    let total_res = state
                        .client()
                        .from("comments")
                        .select("likes")
                        .eq("discussion_id", thread_id.clone())
                        .limit(20)
                        .execute()
                        .await;
                    match total_res {
                        Err(_e) => {
                            continue;
                        }
                        Ok(r) => {
                            let is_maximum =
                                serde_json::from_str::<Vec<Value>>(&r.text().await.unwrap())
                                    .map(|v| v.len() >= 7)
                                    .unwrap_or(true);
                            if is_maximum {
                                state
                                    .discussions
                                    .send_on_by_id(
                                        &thread_id,
                                        &index_client,
                                        json!({
                                            "type":"Error",
                                            "payload":"Comment limit reached"
                                        })
                                        .to_string(),
                                    )
                                    .await;
                                continue;
                            }
                        }
                    }

                    let json = json!([{
                        "message":message,
                        "discussion_id":thread_id,
                        "likes":0
                    }])
                    .to_string();
                    (query_client.insert(json).execute().await, "Create")
                }
                WebMessage::Update { likes, id } => {
                    //Check the maximun of comment likes
                    if likes > 30 {
                        state
                            .discussions
                            .send_on_by_id(
                                &thread_id,
                                &index_client,
                                json!({
                                    "type":"Error",
                                    "payload":"A comment cannot have more than 30 likes."
                                })
                                .to_string(),
                            )
                            .await;
                        continue;
                    }
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
                    tracing::debug!("Error supabase request: {}", e);
                }
                Ok(res) => {
                    let st = res.status().as_u16();
                    if (200..299).contains(&st) {
                        if let Ok(cmm_str) = res.text().await {
                            state
                                .discussions
                                .send_all_by_id(
                                    &thread_id,
                                    &json!({
                                        "type":type_tag,
                                        "payload":cmm_str.to_string()
                                    })
                                    .to_string(),
                                )
                                .await;
                        }
                    }
                }
            }
        }
    }
    state
        .discussions
        .remove_client(&thread_id, &index_client)
        .await
}
