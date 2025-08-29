#!/bin/bash

echo "=== DEBUG: Environment Variable Check ==="
echo "Current directory: $(pwd)"
echo ""

if [ -f .env.production.docker ]; then
    echo "✅ .env.production.docker file exists"
    echo "Contents:"
    cat .env.production.docker
    echo ""
    
    echo "Loading environment variables..."
    source .env.production.docker
    echo "REACT_APP_API_BASE_URL after loading: '$REACT_APP_API_BASE_URL'"
    echo ""
else
    echo "❌ .env.production.docker file not found!"
    exit 1
fi

echo "=== DEBUG: Docker Build Args Test ==="
echo "Testing Docker build with environment file..."
echo "Running: docker compose --env-file .env.production.docker config"
echo ""
docker compose --env-file .env.production.docker config | grep -A 10 -B 5 REACT_APP_API_BASE_URL

echo ""
echo "=== DEBUG: Manual Build Test ==="
echo "Let's try building just the frontend manually to see what happens..."
echo "Running: docker build --build-arg REACT_APP_API_BASE_URL='$REACT_APP_API_BASE_URL' -f frontend/Dockerfile frontend/"
