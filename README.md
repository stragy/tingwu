# Tingwu Zhongkao AI Listening-Speaking Training System

An intelligent English learning platform leveraging multi-AI model collaboration for Chinese middle school students preparing for the Zhongkao English listening and speaking exam.

## Architecture

This project uses a microservices architecture with the following services:

- **Auth Service** (Port 3001): User authentication and authorization
- **User Service** (Port 3002): User profile and learning path management
- **Practice Service** (Port 3003): Exercise delivery and session management
- **Evaluation Service** (Port 3004): Speech evaluation and feedback generation
- **Scheduling Service** (Port 3005): Personalized practice scheduling
- **Analytics Service** (Port 3006): Progress tracking and reporting

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose (for local development)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd tingwu-zhongkao-ai-listening-speaking
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start local development environment

#### Option A: Infrastructure only (recommended for development)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- LocalStack for S3 (port 4566)

Then run services locally:

```bash
npm run dev
```

#### Option B: Full Docker environment

```bash
docker-compose up -d
```

This will start all infrastructure and microservices (ports 3001-3006)

### 5. Verify services are running

```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
```

## Development

### Build all services

```bash
npm run build
```

### Run linting

```bash
npm run lint
```

### Format code

```bash
npm run format
```

### Run tests

```bash
npm test
```

## Project Structure

```
tingwu-zhongkao-ai-listening-speaking/
├── packages/
│   ├── auth-service/
│   ├── user-service/
│   ├── practice-service/
│   ├── evaluation-service/
│   ├── scheduling-service/
│   └── analytics-service/
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Storage**: AWS S3 (LocalStack for development)
- **Containerization**: Docker

## License

Proprietary
