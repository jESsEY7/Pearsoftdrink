# Paya Premium Beverages - E-commerce Application

## Overview

Paya is a modern full-stack e-commerce application for premium energy and soft drinks targeting the youth community in Kenya. The application features a clean, modern UI with glassmorphism design elements, real-time cart management, and integrated payment processing through Stripe and M-Pesa.

## System Architecture

The application follows a monolithic full-stack architecture with clear separation between client and server:

**Frontend**: React with TypeScript, built using Vite
**Backend**: Express.js server with TypeScript
**Database**: PostgreSQL with Drizzle ORM
**UI Framework**: Tailwind CSS with shadcn/ui components
**Payment Processing**: Stripe for card payments, M-Pesa integration planned
**Deployment**: Configured for Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool for fast development and optimized production builds
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and API communication
- **Context API** for cart state and theme management
- **shadcn/ui** component library built on Radix UI primitives

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **Drizzle ORM** for type-safe database operations
- **Neon Database** (serverless PostgreSQL) for cloud-native data storage
- **Stripe SDK** for payment processing
- **Session-based** request logging and error handling

### Database Schema
- **Users table**: Authentication and customer information with Stripe integration
- **Products table**: Beverage catalog with categories (energy/soft), pricing, and inventory
- **Orders table**: Order management with payment tracking and delivery information
- **JSON fields** for flexible order item storage

### State Management
- **Cart Context**: Persistent shopping cart with localStorage synchronization
- **Theme Context**: Dark/light mode toggle with system preference detection
- **Toast Context**: User feedback and notification system

## Data Flow

1. **Product Display**: Frontend fetches product data from `/api/products` endpoint
2. **Cart Management**: Local state with localStorage persistence, no backend dependency
3. **Order Creation**: Cart data sent to `/api/orders` with customer information
4. **Payment Processing**: Stripe Payment Intent creation and confirmation flow
5. **Order Tracking**: Status updates through backend API endpoints

## External Dependencies

### Payment Services
- **Stripe**: Card payment processing with Payment Intents API
- **M-Pesa**: Mobile money integration (planned, infrastructure ready)

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL for scalable data storage
- **Replit**: Development and deployment platform with built-in PostgreSQL

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library for consistent iconography

## Deployment Strategy

**Development Environment**:
- Replit-based development with hot reloading
- Vite dev server for frontend development
- TSX for TypeScript execution in development

**Production Build**:
- Vite builds optimized frontend bundle to `dist/public`
- esbuild compiles server code to `dist/index.js`
- Autoscale deployment target for production scaling

**Database Management**:
- Drizzle migrations for schema versioning
- Environment-based configuration for different deployment stages

**Environment Variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe API key for payment processing
- `VITE_STRIPE_PUBLIC_KEY`: Client-side Stripe public key

## Changelog

Changelog:
- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.