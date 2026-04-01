.PHONY: help install build dev test lint format clean docker-up docker-down docker-logs

help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make build        - Build all services"
	@echo "  make dev          - Run services in development mode"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make docker-up    - Start Docker services"
	@echo "  make docker-down  - Stop Docker services"
	@echo "  make docker-logs  - View Docker logs"

install:
	npm install

build:
	npm run build

dev:
	npm run dev

test:
	npm test

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf node_modules packages/*/node_modules packages/*/dist dist

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f
