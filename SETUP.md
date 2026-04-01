# Setup Guide

This guide will help you set up the Tingwu Zhongkao AI Listening-Speaking Training System for local development.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start infrastructure services (PostgreSQL, Redis, LocalStack)
docker-compose -f docker-compose.dev.yml up -d

# 4. Initialize LocalStack S3 bucket
chmod +x scripts/init-localstack.sh
./scripts/init-localstack.sh

# 5. Build all services
npm run build

# 6. Run services in development mode
npm run dev
```

## Detailed Setup

### Prerequisites

Ensure you have the following installed:

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker >= 20.10.0
- Docker Compose >= 2.0.0
- AWS CLI (for LocalStack initialization)

### Step-by-Step Instructions

#### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies for the root project and all workspace packages.

#### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` if you need to customize any settings. The defaults work for local development.

#### 3. Start Infrastructure Services

For development, it's recommended to run only the infrastructure services in Docker:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- LocalStack (S3) on port 4566

#### 4. Initialize S3 Bucket

```bash
chmod +x scripts/init-localstack.sh
./scripts/init-localstack.sh
```

This creates the `tingwu-audio-recordings` bucket in LocalStack.

#### 5. Build Services

```bash
npm run build
```

This compiles TypeScript to JavaScript for all services.

#### 6. Run Services

You can run all services together:

```bash
npm run dev
```

Or run individual services:

```bash
cd packages/auth-service && npm run dev
cd packages/user-service && npm run dev
# etc.
```

### Verify Installation

Check that all services are running:

```bash
# If running with Docker
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # User Service
curl http://localhost:3003/health  # Practice Service
curl http://localhost:3004/health  # Evaluation Service
curl http://localhost:3005/health  # Scheduling Service
curl http://localhost:3006/health  # Analytics Service
```

## Development Workflow

### Making Changes

1. Make changes to service code in `packages/<service-name>/src/`
2. The service will auto-reload if using `npm run dev`
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Format code: `npm run format`

### Using Make Commands

```bash
make help          # Show all available commands
make install       # Install dependencies
make build         # Build all services
make dev           # Run in development mode
make test          # Run tests
make lint          # Run linter
make format        # Format code
make docker-up     # Start Docker services
make docker-down   # Stop Docker services
make docker-logs   # View Docker logs
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, check what's using the ports:

```bash
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :4566  # LocalStack
lsof -i :3001  # Auth Service
# etc.
```

### Docker Issues

Reset Docker environment:

```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Clean Build

Remove all build artifacts and dependencies:

```bash
npm run clean
npm install
npm run build
```

## Next Steps

After setup is complete:

1. Review the [Design Document](.kiro/specs/tingwu-zhongkao-ai-listening-speaking/design.md)
2. Check the [Tasks](.kiro/specs/tingwu-zhongkao-ai-listening-speaking/tasks.md)
3. Start implementing features according to the task list
