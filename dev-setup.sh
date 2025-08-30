#!/bin/bash
set -e

# Development setup script for board games application
# This script follows the quick start steps from README-dev.md

echo "🚀 Starting Board Games Development Environment..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ All prerequisites are available"

# Step 1: Start backend services (DB + PHP API)
echo ""
echo "📦 Step 1: Starting backend services (Database + PHP API)..."
docker compose -f docker-compose.dev.yml down 2>/dev/null || true
docker compose -f docker-compose.dev.yml up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to start..."
sleep 5

# Check if containers are running
if ! docker compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    echo "❌ Failed to start backend containers"
    docker compose -f docker-compose.dev.yml logs
    exit 1
fi

echo "✅ Backend services started successfully"

# Step 2: Wait for database to be ready and run migrations
echo ""
echo "🗄️  Step 2: Setting up database..."
echo "⏳ Waiting for database to be ready..."

# Wait for MySQL to be ready (max 60 seconds)
for i in {1..12}; do
    if docker compose -f docker-compose.dev.yml exec -T db mysql -u root -psecret -e "SELECT 1" >/dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    if [ $i -eq 12 ]; then
        echo "❌ Database failed to start within 60 seconds"
        docker compose -f docker-compose.dev.yml logs db
        exit 1
    fi
    echo "⏳ Waiting for database... (attempt $i/12)"
    sleep 5
done

# Run fresh migrations with seeding
echo "🌱 Running database migrations and seeding..."
docker compose -f docker-compose.dev.yml exec app php artisan migrate:fresh --seed

if [ $? -eq 0 ]; then
    echo "✅ Database migrations and seeding completed successfully"
else
    echo "❌ Database migration/seeding failed"
    docker compose -f docker-compose.dev.yml logs app
    exit 1
fi

# Step 3: Install frontend dependencies and start development server
echo ""
echo "⚛️  Step 3: Setting up frontend..."
cd frontend

echo "📦 Installing frontend dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Display status and URLs before starting frontend
echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📋 Backend Services Status:"
docker compose -f ../docker-compose.dev.yml ps

echo ""
echo "🌐 Access URLs:"
echo "  • Frontend (React): http://localhost:3001 (starting...)"
echo "  • Backend API: http://localhost:8000"
echo "  • Database: localhost:3306 (user: root, password: secret)"
echo ""
echo " Useful commands:"
echo "  • Stop backend services: docker compose -f docker-compose.dev.yml down"
echo "  • View backend logs: docker compose -f docker-compose.dev.yml logs"
echo "  • Access Laravel container: docker compose -f docker-compose.dev.yml exec app bash"
echo "  • Run artisan commands: docker compose -f docker-compose.dev.yml exec app php artisan [command]"
echo ""
echo "🚀 Starting frontend development server..."
echo "   (Press Ctrl+C to stop the frontend server)"
echo ""

# Start the frontend development server
npm run start
