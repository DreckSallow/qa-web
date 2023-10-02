use axum::http::{HeaderValue, Method};
use tower_http::cors::CorsLayer;

mod app_state;
mod config;
mod web;
use web::router;

pub use config::Config;

#[shuttle_runtime::main]
pub async fn axum(
    #[shuttle_secrets::Secrets] secrets: shuttle_secrets::SecretStore,
) -> shuttle_axum::ShuttleAxum {
    let config = Config::new(secrets).unwrap();
    let cors = CorsLayer::new()
        .allow_origin(config.frontend_url.parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET]);
    Ok(router(config, cors).into())
}
