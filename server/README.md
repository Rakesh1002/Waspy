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
