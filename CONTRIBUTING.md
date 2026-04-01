# Contributing Guidelines

## Code Style

This project uses ESLint and Prettier for code formatting and linting.

### Before Committing

```bash
npm run lint        # Check for linting errors
npm run format      # Format code
npm test            # Run tests
```

## Project Structure

```
tingwu-zhongkao-ai-listening-speaking/
├── packages/
│   ├── auth-service/          # Authentication & authorization
│   ├── user-service/          # User profiles & learning paths
│   ├── practice-service/      # Exercise delivery & sessions
│   ├── evaluation-service/    # Speech evaluation & feedback
│   ├── scheduling-service/    # Personalized scheduling
│   ├── analytics-service/     # Progress tracking & reports
│   └── shared-types/          # Shared TypeScript types
├── scripts/                   # Utility scripts
├── .kiro/specs/              # Feature specifications
└── docker-compose*.yml       # Docker configurations
```

## Adding a New Service

1. Create service directory: `packages/<service-name>/`
2. Add `package.json`, `tsconfig.json`, `Dockerfile`
3. Create `src/index.ts` with Express server
4. Add service to `docker-compose.yml`
5. Update root `README.md`

## TypeScript Guidelines

- Use strict TypeScript settings
- Define interfaces for all data structures
- Use enums for fixed sets of values
- Avoid `any` type (use `unknown` if necessary)
- Export types from `@tingwu/shared-types` for cross-service use

## Testing

- Write unit tests for all business logic
- Use property-based tests for critical functions
- Aim for 80%+ code coverage
- Test files: `*.test.ts` next to source files

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push and create pull request
4. Ensure CI passes before merging

## Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## API Design

- Use RESTful conventions
- Version APIs: `/api/v1/...`
- Return consistent error responses
- Include health check endpoint: `/health`
- Document endpoints in service README
