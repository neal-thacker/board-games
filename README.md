# Family Board Game Library

> **Never again argue about which game to play.** Browse, filter, and discover the perfect board game for any occasion — right from your browser.

---

## What Is This?

A full-stack web app built for families (or any group of board game enthusiasts) to catalog and explore their game collection. Whether you're looking for a quick 20-minute filler, something the 6-year-old can join in on, or an epic 4-player strategy night — the smart filter system has you covered.

Lost in indecision? Hit the **randomizer** and let fate decide.

---

## Features

- **Smart Filters** — search by name, tag, player count, minimum age, and max play time, all at once
- **Game Randomizer** — spin the wheel and get a random pick that matches your current filters
- **Tag System** — organize games into categories like "Family", "Strategy", "Quick Play", etc.
- **Admin Panel** — full CRUD for games and tags (password-protected)
- **Guest Mode** — share with the family, read-only access for browsing
- **Responsive Design** — works great on phone, tablet, or the big screen next to the game shelf
- **QR Code Sharing** — share a game recommendation with a single scan

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS, Flowbite |
| Backend | Laravel 12 (PHP 8.2+) |
| Database | SQLite (drop-in, zero config) |
| Build | Webpack 5 (frontend), Vite (backend assets) |
| Auth | Bearer token — Admin vs Guest roles |

---

## Project Structure

```
board-games/
├── backend/app/          # Laravel API
│   ├── app/
│   │   ├── Models/       # Game, Tag (with many-to-many relationship)
│   │   └── Http/
│   │       ├── Controllers/  # GameController, TagController, AuthController
│   │       └── Middleware/   # AdminAuth
│   ├── database/
│   │   ├── migrations/   # Games, Tags, pivot table
│   │   └── seeders/      # Sample data
│   └── routes/api.php    # All API endpoints
│
└── frontend/             # React SPA
    └── src/
        ├── pages/        # Library, GameView, Tags, Auth, Share, ...
        ├── components/   # Navigation, ProtectedRoute
        ├── contexts/     # AuthContext (login, guest, token management)
        └── api.js        # Centralized API client
```

---

## Getting Started

### Backend

```bash
cd backend/app

# Install dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Set your admin password in .env
# ADMIN_PASSWORD=your_secret_here

# Create the database and run migrations
php artisan migrate

# (Optional) Seed with sample games
php artisan db:seed

# Start the server
php artisan serve
# API available at http://localhost:8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (with hot reload)
npm start
# App available at http://localhost:3001
```

### One-Command Dev Mode (Backend)

If you're in the `backend/app` directory, this starts everything at once:

```bash
composer run dev
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login |
| POST | `/api/auth/guest` | Public | Guest access |
| GET | `/api/games` | Public | List games (filterable, paginated) |
| GET | `/api/games/random` | Public | Random game matching filters |
| POST | `/api/games` | Admin | Add a new game |
| PUT | `/api/games/{id}` | Admin | Edit a game |
| DELETE | `/api/games/{id}` | Admin | Remove a game |
| GET | `/api/tags` | Public | List all tags |
| POST | `/api/tags` | Admin | Create a tag |

**Filter parameters for `GET /api/games`:**
`search`, `tag_ids[]`, `player_count`, `min_age`, `max_time`, `page`, `per_page`

---

## Roles

| Role | Access |
|---|---|
| **Guest** | Browse and filter games, view details, use randomizer |
| **Admin** | Everything above + create, edit, delete games and tags |

Admin login requires the password set in `ADMIN_PASSWORD` in your `.env` file.

---

## Contributing

This is a family project — feel free to fork it and adapt it for your own shelf. Pull requests welcome if you've got ideas to make game night even better.
