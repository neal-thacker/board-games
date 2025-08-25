#!/bin/bash
set -e

# Production build script for board games application
echo "🚀 Building board games application for production..."

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose down

# Use the same build logic as prod.sh
echo "🔨 Building fresh images..."
docker compose build

echo "� Starting containers..."
docker compose up -d

echo "✅ Production build complete!"
echo "🌐 Application should be available at: http://localhost"
echo "📊 Backend API available at: http://localhost:8000/api"

# Show running containers
echo ""
echo "📋 Running containers:"
docker compose ps
