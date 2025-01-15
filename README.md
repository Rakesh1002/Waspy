# WASPY

An enterprise-grade AI-powered WhatsApp support automation platform built with Next.js and FastAPI.

## Tech Stack

### Frontend

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- NextAuth.js for authentication
- Framer Motion for animations

### Backend

- FastAPI
- PostgreSQL with pgvector
- Redis for caching/queues
- MongoDB for conversation history
- OpenAI/Claude for AI processing
- Alembic for migrations

### Infrastructure

- Docker & Docker Compose
- Poetry for Python dependency management
- pnpm for Node.js package management
- GitHub Actions for CI/CD

## Project Structure

```bash
├── client/ # Next.js frontend
│ ├── src/
│ │ ├── app/ # Next.js app router
│ │ ├── components/ # React components
│ │ ├── lib/ # Utilities and helpers
│ │ ├── hooks/ # Custom React hooks
│ │ └── types/ # TypeScript definitions
│ ├── public/ # Static assets
│ └── tests/ # Frontend tests
├── server/ # FastAPI backend
│ ├── app/
│ │ ├── api/ # API routes
│ │ ├── core/ # Core functionality
│ │ ├── models/ # Database models
│ │ ├── services/ # Business logic
│ │ └── utils/ # Utilities
│ ├── tests/ # Backend tests
│ └── alembic/ # Database migrations
├── shared/ # Shared resources
│ ├── types/ # Shared type definitions
│ └── utils/ # Shared utilities
├── docs/ # Documentation
│ ├── api/ # API documentation
│ ├── architecture/ # Architecture docs
│ └── deployment/ # Deployment guides
├── scripts/ # Development scripts
└── docker/ # Docker configurations
```

### Architecture

┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Next.js │────▶ │ FastAPI │────▶│ AI Services │
│ Frontend │ │ Backend │ │ |
└─────────────┘ └──────────────┘ └─────────────┘
│ │ │
│ │ │
│ ┌──────────────┐ │  
 └───────────▶ │ Redis │◀───────────┘
│ Queue │
└──────────────┘
│
▼
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Vector DB │◀───▶ │ PostgreSQL │────▶│ MongoDB │
│ (Search) │ │ (Data) │ │ (History) │
└─────────────┘ └──────────────┘ └─────────────┘

## Features

### Current Implementation

- 🔐 Authentication & Authorization

  - Google OAuth integration
  - Role-based access control (to be implemented)
  - Session management

- 💬 WhatsApp Integration

  - Message sending/receiving
  - Template management (to be implemented)
  - Media handling (to be implemented)
  - Webhook processing

- 🤖 AI Capabilities

  - OpenAI/Claude integration
  - Context-aware responses
  - Knowledge base integration
  - Vector search

- 📊 Analytics & Monitoring
  - Real-time dashboard (to be implemented)
  - Message statistics (to be implemented)
  - Response metrics (to be implemented)
  - User engagement tracking (to be implemented)

### Upcoming Features

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

## Quick Start

1.Clone and setup:

```bash
git clone https://github.com/yourusername/waspy.git
cd waspy

# Install pnpm if not installed
npm install -g pnpm

# Install dependencies
pnpm install
```

2.Install dependencies

```bash
pnpm install # Root dependencies
cd client && pnpm install # Frontend dependencies
cd ../server && poetry install # Backend dependencies
```

3.Configure environment:

```bash
cp .env.example .env
cd client && cp .env.example .env
cd ../server && cp .env.example .env
```

4.Run the development server:

Start infrastructure

```bash
npm run dev
```

Or start services individually:

```bash
npm run dev:frontend # Terminal 1
npm run dev:backend # Terminal 2
```

5.Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deployment

### Production Setup

1. Build Docker images
2. Configure environment variables
3. Setup database migrations
4. Configure reverse proxy
5. Setup SSL certificates

### Scaling Considerations

- Use container orchestration (Kubernetes)
- Implement caching strategies
- Setup load balancing
- Configure auto-scaling
- Monitor performance metrics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow conventional commits
- Write comprehensive tests
- Update documentation
- Follow code style guidelines
- Review security best practices

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Support

- Documentation: [docs/](docs/)
- Issues: GitHub Issues
