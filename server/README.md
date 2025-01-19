# Waspy

A WhatsApp bot API with OpenAI integration and knowledge base management.

## Features

- WhatsApp message handling with template support
- OpenAI integration for intelligent responses
- Knowledge base management with vector search
- Support for multiple file formats (CSV, Excel, PDF, Word)
- PostgreSQL with pgvector for efficient similarity search

## Setup

1. Install dependencies:

```bash
poetry install
```

2. Set up PostgreSQL with pgvector extension:

```sql
CREATE EXTENSION vector;
```

3. Configure environment variables in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5433/waspy
OPENAI_API_KEY=your_api_key
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

4. Run migrations:

```bash
poetry run alembic upgrade head
```

5. Start the server:

```bash
poetry run uvicorn app.main:app --reload --port 8000
```

6. Set up Postgres with pgvector extension:

```bash
   brew install postgresql
   brew install pgvector
   brew services start postgresql
   psql -d postgres -c "CREATE EXTENSION vector;"
```

7. Seed DB

```bash
poetry run python scripts/run_init_db.py
```

8. Check subscription status:
subscribe your WhatsApp Business Account to your app using the following endpoint:

curl -X POST \
'https://graph.facebook.com/v21.0/WHATSAPP_BUSINESS_ACCOUNT_ID/subscribed_apps' \
-H 'Authorization: Bearer ACCESS_TOKEN'
This should give you the following response:

{
  "success": true
}
Then you can confirm the subscription by calling the same endpoint with GET:

curl -X GET \
'https://graph.facebook.com/v21.0/WHATSAPP_BUSINESS_ACCOUNT_ID/subscribed_apps' \
-H 'Authorization: Bearer ACCESS_TOKEN'
Which should look like this:

{
    "data": [
        {
            "whatsapp_business_api_data": {
                "category": "Your App Category",
                "link": "https://www.facebook.com/games/?app_id=1234",
                "name": "Your App Name",
                "id": "1234"
            }
        }
    ]
}
You can find more info here: https://developers.facebook.com/docs/whatsapp/solution-providers/get-started-for-solution-partners#subscribe-waba
7. Check subscription status:
subscribe your WhatsApp Business Account to your app using the following endpoint:

curl -X POST \
'https://graph.facebook.com/v21.0/WHATSAPP_BUSINESS_ACCOUNT_ID/subscribed_apps' \
-H 'Authorization: Bearer ACCESS_TOKEN'
This should give you the following response:

{
  "success": true
}
Then you can confirm the subscription by calling the same endpoint with GET:

curl -X GET \
'https://graph.facebook.com/v21.0/WHATSAPP_BUSINESS_ACCOUNT_ID/subscribed_apps' \
-H 'Authorization: Bearer ACCESS_TOKEN'
Which should look like this:

{
    "data": [
        {
            "whatsapp_business_api_data": {
                "category": "Your App Category",
                "link": "https://www.facebook.com/games/?app_id=1234",
                "name": "Your App Name",
                "id": "1234"
            }
        }
    ]
}
You can find more info here: https://developers.facebook.com/docs/whatsapp/solution-providers/get-started-for-solution-partners#subscribe-waba