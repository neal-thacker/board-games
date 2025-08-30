#!/bin/bash
set -e

# Production build script for board games application
# Usage: ./build-production.sh [--no-cache]

# Check for --no-cache argument
NO_CACHE_FLAG=""
if [[ "$1" == "--no-cache" ]]; then
    NO_CACHE_FLAG="--no-cache"
    echo "🚀 Building board games application for production (no cache)..."
else
    echo "🚀 Building board games application for production..."
    echo "💡 Tip: Use './build-production.sh --no-cache' to force rebuild without cache"
fi

# Load environment variables (mainly for display purposes)
if [ -f .env.production.docker ]; then
    source .env.production.docker
    # Extract the server URL from REACT_APP_API_BASE_URL (remove /api suffix and port if present)
    if [ -n "$REACT_APP_API_BASE_URL" ]; then
        SERVER_URL=$(echo $REACT_APP_API_BASE_URL | sed 's|/api$||' | sed 's|:8000$||')
    else
        SERVER_URL="http://your-server-ip"
    fi
else
    echo "❌ Error: .env.production.docker file not found!"
    echo "Please copy .env.production.docker.example to .env.production.docker and configure it."
    echo "Example commands:"
    echo "  cp .env.production.docker.example .env.production.docker"
    exit 1
fi

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose --env-file .env.production.docker down

# Use the production environment file with Raspberry Pi IP
if [[ -n "$NO_CACHE_FLAG" ]]; then
    echo "🔨 Building images with production configuration (frontend no cache)..."
    docker compose --env-file .env.production.docker build
    echo "🔨 Rebuilding frontend with no cache..."
    docker compose --env-file .env.production.docker build --no-cache frontend
else
    echo "🔨 Building images with production configuration..."
    docker compose --env-file .env.production.docker build
fi

echo "🚀 Starting containers..."
docker compose --env-file .env.production.docker up -d

echo "✅ Production build complete!"
echo "🌐 Application should be available at: $SERVER_URL"
echo "📊 Backend API available at: $REACT_APP_API_BASE_URL"

# Show running containers
echo ""
echo "📋 Running containers:"
docker compose --env-file .env.production.docker ps
