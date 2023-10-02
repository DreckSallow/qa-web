use shuttle_secrets::SecretStore;

pub struct Config {
    pub supabase_url: String,
    pub supabase_key: String,
}

impl Config {
    pub fn new(secrets: SecretStore) -> Option<Self> {
        Some(Self {
            supabase_url: secrets.get("SUPABASE_URL")?,
            supabase_key: secrets.get("SUPABASE_KEY")?,
        })
    }
}
