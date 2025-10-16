# WASPY

An enterprise-grade AI-powered WhatsApp support automation platform built with Next.js and FastAPI.

## Tech Stack

### Frontend

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS with shadcn/ui
- NextAuth.js for authentication
- Prisma ORM
- React Hook Form
- Zod validation

### Backend

- FastAPI
- PostgreSQL with pgvector
- Redis for caching/queues
- MongoDB for conversation history
- OpenAI/Claude for AI processing
- SQLAlchemy ORM
- Alembic migrations
- Poetry for dependency management

### Infrastructure

- Docker & Docker Compose
- pnpm for Node.js package management
- GitHub Actions for CI/CD
- Kubernetes for orchestration

## Features

### Currently Implemented ✅

#### Authentication & Authorization

- Google OAuth integration
- JWT session management
- Role-based access control
- Secure API endpoints

#### WhatsApp Integration

- Business API webhook handling
- Real-time message processing
- Template message support
- Multi-number support
- Message queueing with Redis

#### AI Capabilities

- OpenAI/Claude integration
- Context-aware responses
- Knowledge base with vector search
- Conversation history tracking
- Custom prompt management

#### Analytics & Monitoring

- Message tracking
- Response time metrics
- Error logging and monitoring
- Performance analytics

### Roadmap 🚀

#### Phase 1: Core Enhancements (Q2 2024)

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Custom bot training interface
- [ ] Bulk message campaigns
- [ ] A/B testing capabilities

#### Phase 2: Enterprise Features (Q3 2024)

- [ ] Team collaboration tools
- [ ] Audit logging
- [ ] Custom integrations
- [ ] Advanced security features
- [ ] High availability setup

#### Phase 3: Scale & Optimize (Q4 2024)

- [ ] Performance optimization
- [ ] Load balancing
- [ ] Auto-scaling
- [ ] Disaster recovery
- [ ] Geographic distribution

## Development Setup

### Prerequisites

- Node.js >= 18
- Python >= 3.9
- Docker & Docker Compose
- pnpm >= 8.0.0
- Poetry >= 1.4.0
- PostgreSQL >= 15 with pgvector
- Redis >= 7.0
- MongoDB >= 6.0

### Local Development

1. Clone and setup:

```bash
git clone https://github.com/rakesh1002/waspy.git
cd waspy

# Install package managers
npm install -g pnpm
curl -sSL https://install.python-poetry.org | python3 -
```

2. Install dependencies:

```bash
pnpm install # Root dependencies
cd client && pnpm install # Frontend dependencies
cd ../server && poetry install # Backend dependencies
```

3. Configure environment:

```bash
cp .env.example .env
cd client && cp .env.example .env
cd ../server && cp .env.example .env
```

4. Setup databases:

```bash
# Start infrastructure
docker-compose -f docker-compose.dev.yml up -d

# Run migrations
cd server && poetry run alembic upgrade head
cd ../client && pnpm prisma migrate dev
```

5. Start development servers:

```bash
# All services
pnpm dev

# Or individually
pnpm dev:frontend # Terminal 1
pnpm dev:backend  # Terminal 2
```

### Environment Configuration

#### Frontend (.env)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
DATABASE_URL=postgresql://user:pass@localhost:5432/waspy
```

#### Backend (.env)

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/waspy
REDIS_URL=redis://localhost:6379
MONGODB_URL=mongodb://user:pass@localhost:27017/waspy
OPENAI_API_KEY=your-key
WHATSAPP_API_TOKEN=your-token
WHATSAPP_PHONE_NUMBER_ID=your-id
```

## Production Deployment

### Docker Deployment

1. Build images:

```bash
docker-compose build
```

2. Configure production environment variables

3. Deploy:

```bash
docker-compose up -d
```

### Kubernetes Deployment

1. Configure Kubernetes manifests in `k8s/` directory
2. Apply configurations:

```bash
kubectl apply -f k8s/
```

### Scaling Considerations

- Container orchestration with Kubernetes
- Redis caching layer
- Load balancing with nginx/traefik
- Auto-scaling policies
- Monitoring with Prometheus/Grafana

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Follow conventional commits
- Write comprehensive tests
- Update documentation
- Follow code style guidelines
- Review security best practices
- Add migration scripts for schema changes

## Project Structure

```
├── client/                # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   ├── hooks/        # Custom hooks
│   │   └── types/        # TypeScript types
│   └── tests/            # Frontend tests
├── server/               # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core functionality
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utilities
│   └── tests/           # Backend tests
└── docs/                # Documentation
```

## Support & Documentation

- API Documentation: http://localhost:8000/docs
- Frontend Docs: [docs/frontend/](docs/frontend/)
- Backend Docs: [docs/backend/](docs/backend/)
- Deployment Guides: [docs/deployment/](docs/deployment/)
- Issue Tracker: GitHub Issues

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Architecture

```ascii
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│      Frontend        │      │   Backend Services    │      │     AI Services      │
│                      │      │                       │      │                      │
│    Next.js App    ───┼─────►│     FastAPI       ───┼─────►│    OpenAI/Claude    │
│     Dashboard        │      │      Server          │      │                      │
│                      │      │                      │      │    Vector Search     │
└──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
           │                             │                              │
           │                             │                              │
           │                             ▼                              │
           │                  ┌──────────────────────┐                 │
           │                  │    Redis Queue       │                 │
           │                  │    Cache Layer       │                 │
           │                  └──────────┬───────────┘                 │
           │                             │                             │
           ▼                             ▼                             ▼
┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
│    Data Storage      │      │  External Services    │      │     Monitoring       │
│                      │      │                       │      │                      │
│     PostgreSQL       │      │    WhatsApp API      │      │     Prometheus       │
│     MongoDB          │      │    OAuth Providers    │      │     Grafana         │
│     Redis            │      │                       │      │                      │
└──────────────────────┘      └──────────────────────┘      └──────────────────────┘
```

### Data Flow

1. Frontend communicates with Backend via REST API and WebSocket
2. Backend processes requests through FastAPI server
3. Messages are queued in Redis for async processing
4. AI services handle natural language processing and vector search
5. Data is stored across PostgreSQL, MongoDB, and Redis
6. External services integrate with WhatsApp API and OAuth providers
7. Monitoring tracks system health and performance

### Key Components

#### Frontend Layer

- Next.js dashboard for user interface
- Real-time updates via WebSocket
- Authentication and session management

#### Backend Services

- FastAPI server handling core logic
- Redis for message queuing and caching
- Background task processing

#### AI Processing

- OpenAI/Claude for response generation
- Vector search for knowledge base queries
- Real-time message classification

#### Data Storage

- PostgreSQL with pgvector for primary data
- MongoDB for conversation history
- Redis for caching and session management

#### External Integration

- WhatsApp Business API for messaging
- OAuth providers for authentication
- Monitoring and analytics services
