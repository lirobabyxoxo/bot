# Saya Bot V3 - Discord Bot with Web Dashboard

## Overview

Saya Bot V3 is a multifunctional Discord bot built with Node.js, Discord.js v14, and Express. It provides moderation tools, entertainment features, games, roleplay capabilities, and various utilities for Discord servers. The project includes a React-based web dashboard for configuration and management, alongside the core Discord bot functionality.

The application combines a Discord bot backend with a modern web interface, allowing server administrators to configure bot settings, manage tickets, and monitor server statistics through a user-friendly dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, Vite build tool, and Wouter for routing

**UI Framework**: Radix UI component library with Tailwind CSS for styling. The design system uses custom CSS variables for theming (light/dark modes) with a comprehensive set of pre-built components including cards, dialogs, forms, tables, and data visualization tools.

**State Management**: TanStack React Query (v5) for server state management with custom query client configuration. Queries are configured with no automatic refetching and infinite stale time for manual control.

**Routing Strategy**: Client-side routing using Wouter with a simple two-page structure (Home and NotFound pages). The application is designed as a single-page application with future expansion capability.

**Build Configuration**: Vite configured with custom aliases (@, @shared, @assets) and development-specific plugins including runtime error modal and cartographer for enhanced development experience.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js v18+

**Module System**: ES Modules (type: "module" in package.json)

**Development Workflow**: 
- Development mode uses tsx for TypeScript execution
- Production build uses esbuild for bundling with ESM output format
- Separate build processes for frontend (Vite) and backend (esbuild)

**API Structure**: RESTful API design with all routes prefixed with `/api`. The routes module is set up to return an HTTP server instance, suggesting WebSocket support for real-time Discord bot events.

**Storage Layer**: Abstracted storage interface (IStorage) with in-memory implementation (MemStorage) for development. Production is designed to use Drizzle ORM with PostgreSQL/Neon database.

**Discord Bot Integration**: Uses @discordjs/rest for Discord API interactions. Bot configuration is stored in `server_configs.json` including ticket systems, role assignments, status checkers, and moderation statistics per server (guild).

**Logging System**: Custom Express middleware for request/response logging with timestamp formatting and JSON response capture. Vite integration includes custom logger that exits on errors.

### Data Storage Solutions

**Database ORM**: Drizzle ORM configured for PostgreSQL with Neon serverless driver (@neondatabase/serverless)

**Schema Design**: User authentication schema with UUID primary keys, username/password fields. The schema uses Drizzle Zod integration for runtime validation.

**Session Management**: Configured to use connect-pg-simple for PostgreSQL-backed session storage

**Configuration Storage**: Server-specific configurations stored in JSON file format with nested structure for different bot features:
- Moderation statistics (bans, mutes, kicks)
- Status checker system with role/channel assignments
- Ticket system with category, logs, staff role configuration
- Embed configurations for moderation actions
- Per-server feature toggles

**Development vs Production**: In-memory storage (Map-based) for development with interface design supporting easy migration to database-backed storage in production.

### Authentication and Authorization

**User Management**: Basic user authentication system with username/password credentials stored in database

**Security**: Password hashing expected (schema includes password field) though implementation details not visible in provided files

**Session Strategy**: PostgreSQL-backed sessions using connect-pg-simple package for production environments

### External Dependencies

**Discord Integration**:
- Discord.js v14 for bot functionality
- @discordjs/rest v2.6.0 for REST API interactions
- discord-api-types v0.38.26 for TypeScript type definitions

**Database Services**:
- Neon Serverless PostgreSQL (@neondatabase/serverless v0.10.4)
- Drizzle ORM for type-safe database operations
- connect-pg-simple v10.0.0 for session storage

**Frontend Libraries**:
- React 18+ with TypeScript
- Radix UI component primitives (comprehensive set of 30+ components)
- TanStack React Query v5 for data fetching
- Wouter for routing
- date-fns v3.6.0 for date manipulation
- axios v1.12.2 for HTTP requests
- cmdk v1.1.1 for command palette UI

**Development Tools**:
- Vite for frontend bundling
- esbuild for backend bundling
- tsx for TypeScript execution in development
- Tailwind CSS with autoprefixer for styling
- Replit-specific plugins for development experience

**Validation & Forms**:
- Zod for schema validation
- React Hook Form with @hookform/resolvers v3.10.0
- Drizzle-Zod for database schema validation

**UI Styling**:
- Tailwind CSS v4 (using @tailwindcss/vite plugin)
- class-variance-authority v0.7.1 for component variants
- clsx v2.1.1 for conditional className composition