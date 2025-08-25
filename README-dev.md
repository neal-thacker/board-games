# Board Games Development Setup

## Development Environment

For development, we run only the database and PHP backend in Docker containers, while running the React frontend with npm for faster development cycles.

### Prerequisites

- Docker and Docker Compose
- Node.js and npm

### Quick Start

1. **Start the backend services (DB + PHP API):**
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```
   
   Or if you want to use the main docker-compose but only specific services:
   ```bash
   docker compose up app db -d
   ```

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm install  # First time only
   npm run start
   ```

### Services

- **Database**: MySQL 8 running on `localhost:3306`
- **PHP API**: Laravel app running on `localhost:8000`
- **Frontend**: React app with webpack dev server on `localhost:3001`

### Configuration

- Frontend environment variables are in `frontend/.env`
- The webpack dev server proxies `/api` requests to the backend at `localhost:8000`
- Hot reloading is enabled for React components

#### Production Environment Setup

For production deployment, copy the example environment files and configure them:

```bash
cp .env.production.docker.example .env.production.docker
cp frontend/.env.production.example frontend/.env.production
# Then edit the files with their own IP addresses
```

### Useful Commands

```bash
# Check running containers
docker compose ps

# Stop all containers
docker compose down

# View container logs
docker compose logs app
docker compose logs db

# Access the Laravel container
docker compose exec app bash

# Run Laravel commands
docker compose exec app php artisan migrate
docker compose exec app php artisan tinker
```

### Ports

- Frontend (development): http://localhost:3001
- Backend API: http://localhost:8000
- Database: localhost:3306

### API Endpoints

The React app can make API calls to `/api/*` endpoints, which are automatically proxied to the Laravel backend.

### Troubleshooting

- If port 3001 is in use, the webpack config can be updated to use a different port
- If you get CORS errors, make sure the Laravel app has proper CORS configuration
- Check that both backend containers are running with `docker compose ps`
