mod app_state;
mod web;

use web::router;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();
    let app = router();
    tracing::debug!("listening on http://localhost:3001/");
    axum::Server::bind(&"127.0.0.1:3001".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
    tracing::debug!("Server closed");
}
