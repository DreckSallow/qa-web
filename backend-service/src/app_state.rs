use std::{collections::HashMap, sync::Arc};

use postgrest::Postgrest;
use tokio::sync::{mpsc::UnboundedSender, RwLock};

pub type AppStateT = Arc<AppState>;

pub struct AppState {
    pub client: Postgrest,
    pub threads: RwLock<HashMap<String, HashMap<usize, UnboundedSender<String>>>>,
}
impl AppState {
    pub fn new() -> Self {
        dotenv::dotenv().ok();
        Self {
            client: Postgrest::new(dotenv::var("NEXT_PUBLIC_SUPABASE_URL").unwrap()).insert_header(
                "apikey",
                dotenv::var("NEXT_PUBLIC_SUPABASE_ANON_KEY").unwrap(),
            ),
            threads: RwLock::new(HashMap::default()),
        }
    }
}
