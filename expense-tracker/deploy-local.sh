#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "[1/4] Building images..."
docker compose -f docker-compose.app.yml build --no-cache server client

echo "[2/4] Starting services..."
docker compose -f docker-compose.app.yml up -d

echo "[3/4] Waiting for health checks..."
for i in $(seq 1 60); do
  if curl -sf http://localhost:5000/api/health >/dev/null 2>&1; then
    break
  fi
  echo "Waiting for backend to become ready... ($i/60)"
  sleep 5
done

echo "[4/4] Deployment complete."
echo "Frontend: http://localhost:8080"
echo "Backend health: http://localhost:5000/api/health"
