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

# Load environment variables to get the API URL
if [ -f .env.production.docker ]; then
    source .env.production.docker
    # Check if REACT_APP_API_BASE_URL is set
    if [ -z "$REACT_APP_API_BASE_URL" ]; then
        echo "❌ Error: REACT_APP_API_BASE_URL is not set in .env.production.docker!"
        echo "Please edit .env.production.docker and set REACT_APP_API_BASE_URL to your server's IP address."
        echo "Example: REACT_APP_API_BASE_URL=http://192.168.1.76:8000/api"
        exit 1
    fi
    # Extract the base URL without /api suffix for display
    SERVER_URL=$(echo $REACT_APP_API_BASE_URL | sed 's|/api$||')
else
    echo "❌ Error: .env.production.docker file not found!"
    echo "Please copy .env.production.docker.example to .env.production.docker and configure it."
    echo "Example commands:"
    echo "  cp .env.production.docker.example .env.production.docker"
    echo "  # Then edit .env.production.docker and set REACT_APP_API_BASE_URL=http://192.168.1.76:8000/api"
    exit 1
fi

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose --env-file .env.production.docker down

# Use the production environment file with Raspberry Pi IP
if [[ -n "$NO_CACHE_FLAG" ]]; then
    echo "🔨 Building fresh images with production configuration (no cache)..."
    docker compose --env-file .env.production.docker build --no-cache
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
