# Copilot Instructions for Board Games Project

## Project Overview
This is a full-stack board games management application with a Laravel backend and React frontend, containerized with Docker.

## Backend Development Standards (Laravel)

### Code Standards
- Follow Laravel coding conventions and PSR-12 standards
- Use Laravel's built-in features and best practices:
  - Eloquent ORM for database operations
  - Form Request validation classes
  - Resource controllers with proper REST conventions
  - API Resources for data transformation
  - Laravel's dependency injection container
  - Artisan commands for custom CLI operations

### Database
- Use Laravel migrations for all database schema changes
- Follow Laravel naming conventions for tables, columns, and relationships
- Use Eloquent relationships (hasMany, belongsTo, etc.) instead of raw queries
- Implement proper foreign key constraints and indexes

### API Development
- Use Laravel API Resources for consistent JSON responses
- Implement proper HTTP status codes
- Use Laravel's built-in validation rules
- Follow RESTful API conventions
- Include proper error handling and exception responses

### Testing
- Write Feature tests for API endpoints
- Write Unit tests for business logic
- Use Laravel's testing helpers and factories
- Follow Laravel's testing best practices

## Frontend Development Standards (React)

### Component Library
- **Use Flowbite React components wherever applicable** instead of building custom components
- Reference the Flowbite React documentation for component usage
- Maintain consistent styling and behavior through Flowbite components
- Examples of preferred Flowbite components:
  - Forms: TextInput, Select, Textarea, Button
  - Layout: Card, Modal, Navbar, Sidebar
  - Data Display: Table, Badge, Alert
  - Navigation: Pagination, Breadcrumb, Tabs

### React Best Practices
- Use functional components with hooks
- Implement proper state management
- Use React Router for navigation
- Follow component composition patterns
- Implement proper error boundaries

### Styling
- Use Tailwind CSS classes (included with Flowbite)
- Maintain responsive design principles
- Follow Flowbite's design system for consistency

## File Structure Guidelines

### Backend (Laravel)
- Controllers in `app/Http/Controllers/`
- Models in `app/Models/`
- Migrations in `database/migrations/`
- Seeders in `database/seeders/`
- API routes in `routes/api.php`

### Frontend (React)
- Components in `src/pages/` and organized subdirectories
- API calls in `src/api.js`
- Shared utilities and helpers in appropriate subdirectories

## Development Workflow
- **IMPORTANT: Always use `docker-compose.dev.yml` for development**
  - Use `docker compose -f docker-compose.dev.yml up` to start the development environment
  - Use `docker compose -f docker-compose.dev.yml exec app bash` to access the Laravel container
- Use Docker for local development environment
- Backend runs on Laravel with SQLite database
- Frontend uses React with Webpack bundling
- Follow Git best practices for commits and branching

## When Making Changes
1. **Backend changes**: Always follow Laravel conventions and use built-in Laravel features
2. **Frontend changes**: Prioritize Flowbite React components for UI elements
3. **Database changes**: Use Laravel migrations and Eloquent relationships
4. **API endpoints**: Follow RESTful conventions with proper HTTP methods and status codes
5. **Testing**: Include appropriate tests for new functionality