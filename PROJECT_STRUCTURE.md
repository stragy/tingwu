# Project Structure

## Overview

This is a TypeScript monorepo using npm workspaces for the Tingwu Zhongkao AI Listening-Speaking Training System.

## Directory Structure

```
tingwu-zhongkao-ai-listening-speaking/
│
├── packages/                          # Microservices packages
│   ├── auth-service/                 # Port 3001
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── user-service/                 # Port 3002
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── practice-service/             # Port 3003
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── evaluation-service/           # Port 3004
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── scheduling-service/           # Port 3005
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── analytics-service/            # Port 3006
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared-types/                 # Shared TypeScript types
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/                          # Utility scripts
│   └── init-localstack.sh           # Initialize S3 bucket
│
├── .kiro/                           # Kiro specifications
│   └── specs/
│       └── tingwu-zhongkao-ai-listening-speaking/
│           ├── design.md
│           ├── requirements.md
│           └── tasks.md
│
├── Configuration Files
│   ├── package.json                 # Root package with workspaces
│   ├── tsconfig.json                # Base TypeScript config
│   ├── .eslintrc.json              # ESLint configuration
│   ├── .prettierrc.json            # Prettier configuration
│   ├── .prettierignore             # Prettier ignore patterns
│   ├── .gitignore                  # Git ignore patterns
│   ├── .dockerignore               # Docker ignore patterns
│   └── .env.example                # Environment variables template
│
├── Docker Files
│   ├── docker-compose.yml          # Full Docker environment
│   ├── docker-compose.dev.yml      # Infrastructure only
│   └── Dockerfile.base             # Base Dockerfile template
│
├── Documentation
│   ├── README.md                   # Main project documentation
│   ├── SETUP.md                    # Setup instructions
│   ├── CONTRIBUTING.md             # Contributing guidelines
│   └── PROJECT_STRUCTURE.md        # This file
│
└── Makefile                        # Make commands for convenience
```

## Services

### 1. Auth Service (Port 3001)
- User registration and login
- JWT token management
- Session handling
- Password encryption

**Dependencies:**
- Express, TypeORM, PostgreSQL, Redis
- bcrypt, jsonwebtoken
- helmet, cors, express-rate-limit

### 2. User Service (Port 3002)
- User profile management
- Baseline assessment coordination
- Learning path generation
- Progress tracking

**Dependencies:**
- Express, TypeORM, PostgreSQL, Redis
- helmet, cors

### 3. Practice Service (Port 3003)
- Exercise content delivery
- Session state management
- Audio recording coordination
- Practice history tracking

**Dependencies:**
- Express, TypeORM, PostgreSQL, Redis
- AWS SDK (S3), multer
- helmet, cors

### 4. Evaluation Service (Port 3004)
- OpenClaw evaluation workflow
- Multi-dimensional scoring
- Detailed feedback generation
- Error pattern identification

**Dependencies:**
- Express, TypeORM, PostgreSQL, Redis
- AWS SDK (S3)
- helmet, cors

### 5. Scheduling Service (Port 3005)
- Personalized practice schedules
- Performance-based adaptation
- Question type distribution
- Mock exam scheduling

**Dependencies:**
- Express, TypeORM, PostgreSQL, Redis
- helmet, cors

### 6. Analytics Service (Port 3006)
- Progress tracking and visualization
- Performance trend analysis
- Report generation
- Comparative analytics

**Dependencies:**
- Express, TypeORM, PostgreSQL, Redis
- helmet, cors

### 7. Shared Types Package
- Common TypeScript interfaces and types
- Enums for exercise types, error types, etc.
- Shared data models

## Infrastructure

### Database (PostgreSQL)
- Port: 5432
- User: tingwu
- Database: tingwu_db

### Cache (Redis)
- Port: 6379
- Used for session management and caching

### Object Storage (LocalStack S3)
- Port: 4566
- Bucket: tingwu-audio-recordings
- Used for audio file storage

## Technology Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.3+
- **Framework:** Express.js 4.18+
- **ORM:** TypeORM 0.3+
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Storage:** AWS S3 (LocalStack for dev)
- **Containerization:** Docker & Docker Compose

## Development Tools

- **Linting:** ESLint with TypeScript plugin
- **Formatting:** Prettier
- **Testing:** Jest
- **Build:** TypeScript Compiler (tsc)
- **Package Manager:** npm with workspaces

## Next Steps

1. Install dependencies: `npm install`
2. Start infrastructure: `docker-compose -f docker-compose.dev.yml up -d`
3. Initialize S3: `./scripts/init-localstack.sh`
4. Build services: `npm run build`
5. Run services: `npm run dev`

See [SETUP.md](SETUP.md) for detailed setup instructions.
