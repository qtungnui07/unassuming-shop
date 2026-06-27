#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but was not found."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose is required but was not found."
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example."
fi

echo "Installing dependencies..."
npm install

echo "Starting PostgreSQL..."
docker compose up -d --wait postgres

echo "Applying database migrations..."
npm run db:migrate

echo "Seeding database..."
npm run db:seed

echo "Local setup is ready."
