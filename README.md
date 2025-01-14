# WhatsApp Support Bot Platform

An enterprise-grade AI-powered WhatsApp support automation platform built with Next.js and FastAPI.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Development Guide](#development-guide)
- [Deployment Guide](#deployment-guide)
- [Testing Guide](#testing-guide)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## Features

- 🤖 AI-powered chatbot with Anthropic Claude 3.5 integration
- 📱 WhatsApp Business API integration
- 📚 Document processing & vector search
- 📊 Real-time analytics dashboard
- 🔐 Enterprise-grade security
- 🔄 Horizontal scaling support
- 📈 Performance monitoring

🚧 In Progress:
- [ ] Document processing & vector search
- [ ] Multi-language support
- [ ] Custom bot training
- [ ] Advanced analytics
- [ ] Team collaboration features

### System Components

```ascii
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│   FastAPI    │────▶│   OpenAI    │
│  Frontend   │     │   Backend    │     │   Engine    │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │                    │
       │                    ▼                    │
       │            ┌──────────────┐             │
       └───────────▶│    Redis     │◀────────────┘
                    │    Queue     │
                    └──────────────┘
                           │
                           ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Pinecone   │◀───▶│  PostgreSQL  │────▶│  MongoDB    │
│   Vector    │     │     Data     │     │   History   │
└─────────────┘     └──────────────┘     └─────────────┘
```

## Development Guide

### Prerequisites

1. Install Required Tools:

```bash
# Install Python 3.9+
pyenv install 3.9.13
pyenv global 3.9.13

# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Install Node.js 18+
nvm install 18
nvm use 18

# Install Docker
# Follow instructions at https://docs.docker.com/get-docker/
```

2. Clone and Setup:

```bash
git clone https://github.com/yourusername/waspy.git
cd waspy

# Install frontend dependencies
npm install

# Install backend dependencies
cd whatsapp-api
npm install
```

### Local Development

1. Start Infrastructure:

```bash
# Start required services
docker-compose -f docker-compose.dev.yml up -d

# Verify services are running
docker-compose ps
```

2. Setup Database:

```bash
# Create database
poetry run python scripts/create_db.py

# Run migrations
poetry run alembic upgrade head

# Seed initial data
poetry run python scripts/seed_data.py
```

3. Configure Environment:

```bash
# Copy environment files
cp .env.example .env

# WhatsApp API directory
cd whatsapp-api
cp .env.example .env
```

4. Start Development Servers:

```bash
# Terminal 1: Start backend
poetry run uvicorn backend.main:app --reload

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Start worker
poetry run python -m backend.worker
```

## Project Roadmap

### Phase 1: Core Platform (Current) ⏳

- [x] Basic authentication and user management
- [x] WhatsApp Business API integration
- [x] Simple AI chat responses
- [x] Real-time chat interface
- [ ] Basic analytics dashboard
- [ ] Initial deployment setup

### Phase 2: Enhanced Features 🔄

- [ ] Document ingestion and processing
- [ ] Vector search implementation
- [ ] Custom bot training interface
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Multi-language support

### Phase 3: Enterprise Features 🎯

- [ ] Role-based access control
- [ ] Audit logging
- [ ] Custom integrations
- [ ] Advanced security features
- [ ] High availability setup
- [ ] Automated backups

## Remaining Tasks

### High Priority
1. Complete the analytics dashboard implementation
2. Add document processing capabilities
3. Implement vector search for knowledge base
4. Set up automated testing pipeline
5. Add error monitoring and logging

### Medium Priority
1. Enhance bot training interface
2. Add support for multiple languages
3. Implement team collaboration features
4. Create comprehensive API documentation
5. Add integration tests

### Low Priority
1. Add more customization options
2. Implement advanced security features
3. Create admin dashboard
4. Add support for more messaging platforms
5. Implement automated backups

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

- Follow the established code style and conventions
- Write tests for new features
- Update documentation as needed
- Use conventional commits
- Keep PRs focused and manageable in size

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or join our Discord channel.

---

**Note**: This is an active development project. Features and priorities may change based on user feedback and business requirements.
