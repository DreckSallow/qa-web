# QA - Websockets Service

This service enables real-time messaging, updates, and message removal in QA discussions.
It is designed to work seamlessly with the [Shuttle](https://www.shuttle.rs/) deployment platform.


Before running this project, you need to set up some environment variables.
Create a *Secrets.toml* file in the project directory and provide the following variables with their corresponding values:

```.env
  SUPABASE_URL="Your Supabase URL"
  SUPABASE_KEY="Your Supabase Secret Key"
  ORIGIN_URL="Your Frontend URL" # To avoid CORS errors
```
