use std::{collections::HashMap, sync::Arc};

use postgrest::Postgrest;
use tokio::sync::{mpsc::UnboundedSender, RwLock};

pub type AppStateT = Arc<AppState>;

pub type DiscussionsMap = HashMap<usize, UnboundedSender<String>>;

pub struct DiscussionsManager {
    discussions: RwLock<HashMap<String, DiscussionsMap>>,
}

impl DiscussionsManager {
    pub fn new() -> Self {
        Self {
            discussions: RwLock::new(HashMap::default()),
        }
    }

    pub async fn send_all_by_id(&self, discussion_id: &String, msg: &str) {
        if let Some(discussions) = self.discussions.read().await.get(discussion_id) {
            for sender in discussions.values() {
                if let Err(e) = sender.send(msg.into()) {
                    tracing::info!("ERROR send all: {:?}", e);
                }
            }
        }
    }
    pub async fn send_on_by_id(&self, discussion_id: &String, client_id: &usize, msg: String) {
        if let Some(sender) = self
            .discussions
            .read()
            .await
            .get(discussion_id)
            .and_then(|d| d.get(client_id))
        {
            if let Err(e) = sender.send(msg) {
                tracing::info!("ERROr send one: {:?}", e);
            };
        }
    }
    pub async fn remove_client(&self, discussion_id: &String, client_id: &usize) {
        let mut discussions = self.discussions.write().await;
        if let Some(v) = discussions.get_mut(discussion_id) {
            v.remove(client_id);
        }
    }
    pub async fn add_client(
        &self,
        discussion_id: &String,
        client_id: usize,
        tx: UnboundedSender<String>,
    ) {
        let mut discussions = self.discussions.write().await;
        if let Some(v) = discussions.get_mut(discussion_id) {
            v.insert(client_id, tx);
        } else {
            let mut new_hash = HashMap::new();
            new_hash.insert(client_id, tx);
            discussions.insert(discussion_id.clone(), new_hash);
        };
    }
    // pub async fn get_info(&self) -> HashMap<String, usize> {
    //     let mut info = HashMap::new();
    //     for (k, v) in self.discussions.read().await.iter() {
    //         info.insert(k.clone(), v.len());
    //     }
    //     info
    // }
}

pub struct AppState {
    client: Postgrest,
    pub discussions: DiscussionsManager,
}
impl AppState {
    pub fn new(sup_url: &str, sup_key: &str) -> Self {
        Self {
            client: Postgrest::new(sup_url).insert_header("apikey", sup_key),
            discussions: DiscussionsManager::new(),
        }
    }
    #[inline]
    pub fn client(&self) -> &Postgrest {
        &self.client
    }
}
