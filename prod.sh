#!/bin/bash
set -e

echo "🔨 Building fresh images..."
docker compose build

echo "🚀 Starting containers..."
docker compose up -d

echo "✅ Deployment complete. Check logs with: docker compose logs -f"
