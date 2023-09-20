use std::{collections::HashMap, sync::Arc};

use postgrest::Postgrest;

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
use tokio::sync::{
    mpsc::{self, UnboundedSender},
    RwLock,
};

type AppStateT = Arc<AppState>;

struct AppState {
    client: Postgrest,
    threads: RwLock<HashMap<String, Vec<UnboundedSender<String>>>>,
}
impl AppState {
    pub fn new() -> Self {
        Self {
            client: Postgrest::new(dotenv::var("NEXT_PUBLIC_SUPABASE_URL").unwrap()).insert_header(
                "apikey",
                dotenv::var("NEXT_PUBLIC_SUPABASE_ANON_KEY").unwrap(),
            ),
            threads: RwLock::new(HashMap::default()),
        }
    }
}

async fn index_route() -> Html<&'static str> {
    Html("<h1>Hello World</h1>")
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();
    dotenv::dotenv().ok();
    let app = Router::new()
        .route("/", get(index_route))
        .route("/thread/:thread_id", get(thread_route))
        .with_state(Arc::new(AppState::new()));
    tracing::debug!("listening on http://localhost:3001/");
    axum::Server::bind(&"127.0.0.1:3001".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
    tracing::debug!("Server closed");
}

async fn thread_route(
    ws: WebSocketUpgrade,
    Path(thread_id): Path<String>,
    State(app_state): State<AppStateT>, // ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    tracing::debug!("Threads request: {}", thread_id);
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
    {
        //Add the new user to thread_id users
        let mut threads = state.threads.write().await;
        if threads.contains_key(&thread_id) {
            if let Some(v) = threads.get_mut(&thread_id) {
                v.push(tx);
            };
        } else {
            threads.insert(thread_id.clone(), vec![tx]);
        }
    }
    // Listen user messages
    while let Some(Ok(msg)) = receiver.next().await {
        println!("{:?}", msg);
        if let Message::Text(msg_text) = msg {
            if let Some(threads) = state.threads.read().await.get(&thread_id) {
                for thread in threads {
                    if let Err(e) = thread.send(format!("HOLA BRO: {}", msg_text)) {
                        tracing::info!("ERROR SENDING MESSAGE: {:?}", e);
                    };
                }
            }
        }
    }

    tracing::info!("HANDLE SOCKET END");
    return;
}
