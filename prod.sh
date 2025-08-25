#!/bin/bash
set -e

echo "🔨 Building fresh images..."
docker compose build --no-cache

echo "🚀 Starting containers..."
docker compose up -d

echo "✅ Deployment complete. Check logs with: docker compose logs -f"
