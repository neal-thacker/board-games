#!/bin/bash

echo "=== DEBUG: Inspect Built React App ==="
echo "This script will extract and examine the built React app to see what API URL is baked in"
echo ""

# Get the frontend container
CONTAINER_ID=$(docker ps --filter "name=react-frontend" --format "{{.ID}}")

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ react-frontend container not found. Is it running?"
    echo "Try running: docker compose --env-file .env.production.docker up -d"
    exit 1
fi

echo "✅ Found react-frontend container: $CONTAINER_ID"
echo ""

echo "=== Extracting JavaScript files to check for hardcoded URLs ==="
echo "Looking for any references to localhost or 192.168.1.76..."

# Copy the built files from the container
docker cp "$CONTAINER_ID:/usr/share/nginx/html" ./temp-frontend-debug

echo ""
echo "Searching for API URLs in built JavaScript files..."
echo "Looking for localhost:"
find ./temp-frontend-debug -name "*.js" -exec grep -l "localhost" {} \; 2>/dev/null || echo "No localhost found"

echo ""
echo "Looking for 192.168.1.76:"
find ./temp-frontend-debug -name "*.js" -exec grep -l "192.168.1.76" {} \; 2>/dev/null || echo "No 192.168.1.76 found"

echo ""
echo "Looking for /api:"
find ./temp-frontend-debug -name "*.js" -exec grep -l "/api" {} \; 2>/dev/null || echo "No /api found"

echo ""
echo "=== Content of main JavaScript files ==="
echo "Searching for API_BASE_URL or similar patterns..."
find ./temp-frontend-debug -name "*.js" -exec grep -H "API\|localhost\|192\.168" {} \; 2>/dev/null

# Clean up
rm -rf ./temp-frontend-debug

echo ""
echo "Debug complete!"
