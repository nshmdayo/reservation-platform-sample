# Beauty Salon Reservation System

A beauty salon reservation system similar to HotPepper. Built with Next.js + TypeScript + Tailwind CSS for the frontend and Go + Gin + PostgreSQL for the backend.

## Technology Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SWR (Data fetching)
- React Hook Form (Form management)
- Axios (HTTP client)

### Backend
- Go 1.21+
- Gin (Web framework)
- GORM (ORM)
- PostgreSQL (Database)
- Redis (Cache & Session)
- JWT (Authentication)

## Project Structure

```
├── frontend/          # Next.js frontend
│   ├── src/
│   │   ├── app/      # App Router pages
│   │   ├── components/ # UI components
│   │   └── lib/      # API, type definitions, utilities
│   ├── package.json
│   └── tailwind.config.js
├── backend/           # Go backend
│   ├── cmd/
│   │   ├── server/   # Production server
│   │   └── demo/     # Demo server
│   ├── internal/
│   │   ├── api/      # HTTP handlers & routes
│   │   ├── domain/   # Domain models
│   │   ├── infrastructure/ # DB & external services
│   │   └── services/ # Business logic
│   ├── go.mod
│   └── Dockerfile
├── docker-compose.yml # Docker configuration for development
└── .github/
    └── instructions/  # Implementation guides
```

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd reservation-platform-sample
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:3000

### 3. Backend Setup

#### Full Development Environment (PostgreSQL + Redis)
```bash
# Start Docker environment
docker-compose up -d

# Start backend
cd backend
go mod download
go run cmd/server/main.go
```

#### Demo Environment (No database required)
```bash
cd backend
go mod download
go run cmd/demo/main.go
```
Backend API runs at http://localhost:8081

### 4. Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8081
- **API Health Check**: http://localhost:8081/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Adminer (DB Management)**: http://localhost:8081

## Key Features

### ✅ Implemented Features

#### User Features
- 🏠 **Homepage** - Service introduction and navigation
- 🔍 **Salon Search & Listing** - Search by name or location
- 🏪 **Salon Detail Information** - Store info, staff, and menu display
- 📅 **Booking Calendar & Availability Check** - Real-time availability status
- ✏️ **Booking Form** - Staff, menu, and date/time selection
- 📋 **Reservation Management** - Reservation list, details, and cancellation

#### System Features
- 🎨 **Responsive Design** - Mobile first
- 🔒 **Authentication System** - JWT authentication (demo implementation)
- 🌐 **REST API** - CORS support, proper HTTP status codes
- 📊 **Error Handling** - User-friendly error display

### 🚧 Future Implementation Plans

#### User Features
- User registration & login functionality
- Profile management
- Favorite salon feature
- Reservation history & review functionality

#### Admin Features
- Salon information management screen
- Staff management
- Service & menu management
- Reservation management dashboard
- Sales reports

#### Advanced Features
- Location-based search
- Push notifications
- Payment functionality
- Review & rating system

## Development Guide

### API Endpoints

#### Salon Related
```
GET  /api/salons           # Salon list
GET  /api/salons/:id       # Salon details
GET  /api/salons/:id/slots # Get available time slots
```

#### Reservation Related
```
POST /api/reservations     # Create reservation
GET  /api/reservations     # Reservation list
GET  /api/reservations/:id # Reservation details
PUT  /api/reservations/:id # Update reservation
DELETE /api/reservations/:id # Cancel reservation
```

#### Authentication Related
```
POST /api/auth/register    # User registration
POST /api/auth/login       # Login
GET  /api/auth/me          # Get user information
```

### Code Style

- **Frontend**: TypeScript + ESLint + Prettier
- **Backend**: Go fmt + golint

### Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
go test ./...
```

## Deployment

### Docker
```bash
# Build everything
docker-compose -f docker-compose.prod.yml up --build

# Individual builds
docker build -t reservation-frontend ./frontend
docker build -t reservation-backend ./backend
```

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is released under the MIT License.

## Development References

- [Frontend Implementation Guide](./.github/instructions/frontend.md)
- [Backend Implementation Guide](./.github/instructions/backend.md)