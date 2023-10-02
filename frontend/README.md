# QA_WEB - Frontend Project

To run the frontend you need to provide some env variables in a `.env.local` or `.env` file: 

```.env
  NEXT_PUBLIC_SUPABASE_URL="supabase_url"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="secure key :p"
  NEXT_PUBLIC_API_URL="server api url"  
```
> The `NEXT_PUBLIC_API_URL` refers to the **backend api service** that allow the websockets conections
> for real-time messages
