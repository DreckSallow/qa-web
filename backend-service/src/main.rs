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
    Ok(router(config).into())
}
