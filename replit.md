# StockPulse Predictor

## Overview

StockPulse Predictor is an AI-powered stock analysis and prediction platform that provides users with data-driven investment insights. The application combines real-time stock market data with AI-based predictions to help users make informed trading decisions. Users can search for stocks, view detailed charts, receive Buy/Sell/Hold recommendations, maintain personalized watchlists, and share reviews about prediction accuracy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety and modern component patterns
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (replacing React Router)

**UI Component System**
- Shadcn/ui (New York variant) - a component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design philosophy: Hybrid approach combining modern fintech aesthetics (inspired by Robinhood, Webull) with Material Design principles
- Typography: Inter for UI text, JetBrains Mono for numerical/stock data
- Custom color system with CSS variables supporting light/dark themes
- Recharts library for data visualization (stock price charts)

**State Management**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React Context for authentication state and theme management
- Local state with useState/useReducer for component-level state

**Form Handling**
- React Hook Form with Zod validation for type-safe form schemas
- @hookform/resolvers for integrating Zod schemas with React Hook Form

### Backend Architecture

**Server Framework**
- Node.js with Express.js for RESTful API endpoints
- TypeScript throughout for consistency with frontend

**API Design Pattern**
- RESTful architecture with clear resource-based endpoints
- JWT-based authentication middleware for protected routes
- Centralized error handling and request/response logging
- JSON request/response format

**Key API Endpoints**
- `/api/auth/register` - User registration with bcrypt password hashing
- `/api/auth/login` - User authentication returning JWT token
- `/api/stocks/quote` - Fetch real-time stock quotes
- `/api/stocks/chart` - Retrieve historical price data for charting
- `/api/predict` - Generate AI-powered stock predictions (Buy/Sell/Hold)
- `/api/watchlist` - CRUD operations for user watchlists
- `/api/reviews` - CRUD operations for user reviews

**Development Environment**
- Vite middleware mode for seamless frontend/backend integration during development
- Hot module replacement for rapid development iteration
- Custom logging system for request tracking

### Authentication & Authorization

**Strategy**
- JWT (JSON Web Tokens) for stateless authentication
- Tokens stored in localStorage on client side
- Bearer token authentication via Authorization header
- bcryptjs for secure password hashing (10 salt rounds)
- 7-day token expiration period

**Security Measures**
- Password requirements enforced via Zod schemas (minimum 6 characters)
- Protected routes using authMiddleware on backend
- ProtectedRoute wrapper component on frontend
- Automatic token validation on API requests

### Data Storage

**Database System**
- PostgreSQL as the primary database (via Neon serverless driver)
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with TypeScript types generated from Drizzle schemas

**Schema Design**
- `users` table: Stores user credentials, profile info, and watchlist arrays
- `reviews` table: User-generated reviews with foreign key to users table
- UUID primary keys with automatic generation
- Timestamps for record creation tracking
- Cascade deletes for maintaining referential integrity

**Migration Strategy**
- Drizzle Kit for schema migrations
- Push-based deployment with `db:push` command
- Migration files stored in `/migrations` directory

**In-Memory Fallback**
- MemStorage class provides in-memory storage implementation
- Useful for development and testing without database dependency
- Implements same interface (IStorage) as database storage layer

### External Dependencies

**Stock Market Data**
- Alpha Vantage API for real-time stock quotes and historical data
- API key required via `ALPHA_VANTAGE_API_KEY` environment variable
- Endpoints used:
  - `GLOBAL_QUOTE` - Current stock price and daily statistics
  - `TIME_SERIES_INTRADAY` - Intraday price data (1-day range)
  - `TIME_SERIES_DAILY` - Daily historical prices
  - `TIME_SERIES_WEEKLY` - Weekly aggregated data
  - `TIME_SERIES_MONTHLY` - Monthly aggregated data

**AI Prediction Logic**
- Server-side prediction algorithm in `lib/stock-api.ts`
- Analyzes price momentum, volatility, and volume trends
- Returns Buy/Sell/Hold recommendation with confidence percentage
- Algorithm considers:
  - 7-day price change percentage
  - Recent volatility patterns
  - Volume analysis
  - Random confidence scoring (placeholder for ML model)

**Font Resources**
- Google Fonts: Inter (primary UI font), JetBrains Mono (monospace for data)
- Loaded via HTML link tags for optimal performance

**Development Tools (Replit-specific)**
- @replit/vite-plugin-runtime-error-modal - Enhanced error reporting
- @replit/vite-plugin-cartographer - Code navigation
- @replit/vite-plugin-dev-banner - Development environment indicators

**Environment Variables Required**
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `ALPHA_VANTAGE_API_KEY` - Stock data API access
- `SESSION_SECRET` - JWT signing secret (defaults to placeholder in development)
- `NODE_ENV` - Environment flag (development/production)

### Design System

**Color Theming**
- CSS custom properties with HSL color space for theme flexibility
- Automatic light/dark mode support via class-based theming
- Semantic color tokens: primary, secondary, accent, destructive, muted
- Specialized financial colors: gain (green) and loss (red) for stock data

**Component Patterns**
- Elevation system using hover/active states (hover-elevate, active-elevate-2)
- Consistent spacing scale based on Tailwind's spacing units (4, 6, 8, 12, 16, 24)
- Card-based layouts with consistent padding and border radius
- Responsive grid layouts with mobile-first approach

**Accessibility Considerations**
- ARIA labels and roles on interactive elements
- Focus management with ring-based focus indicators
- Keyboard navigation support via Radix UI primitives
- Screen reader-friendly component structure