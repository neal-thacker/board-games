#!/bin/bash
set -e

# Production build script for board games application
echo "🚀 Building board games application for production..."

# Load environment variables to get the API URL
if [ -f .env.production.docker ]; then
    source .env.production.docker
    # Extract the base URL without /api suffix for display
    SERVER_URL=$(echo $REACT_APP_API_BASE_URL | sed 's|/api$||')
else
    echo "❌ Error: .env.production.docker file not found!"
    echo "Please copy .env.production.docker.example to .env.production.docker and configure it."
    exit 1
fi

# Stop existing containers
echo "📦 Stopping existing containers..."
docker compose --env-file .env.production.docker down

# Use the production environment file with Raspberry Pi IP
echo "🔨 Building fresh images with production configuration..."
docker compose --env-file .env.production.docker build

echo "🚀 Starting containers..."
docker compose --env-file .env.production.docker up -d

echo "✅ Production build complete!"
echo "🌐 Application should be available at: $SERVER_URL"
echo "📊 Backend API available at: $REACT_APP_API_BASE_URL"

# Show running containers
echo ""
echo "📋 Running containers:"
docker compose --env-file .env.production.docker ps
