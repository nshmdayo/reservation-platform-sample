# Backend Implementation Guide

## Technology Stack
- Go 1.21+
- Gin (Web framework)
- GORM (ORM)
- PostgreSQL (Database)
- Redis (Cache & Session)
- JWT (Authentication)
- Docker & Docker Compose

## Project Structure
```
backend/
├── cmd/
│   └── server/
│       └── main.go                 # Entry point
├── internal/
│   ├── api/
│   │   ├── handlers/               # HTTP handlers
│   │   │   ├── salon.go
│   │   │   ├── staff.go
│   │   │   ├── service.go
│   │   │   ├── reservation.go
│   │   │   └── auth.go
│   │   ├── middleware/             # Middleware
│   │   │   ├── auth.go
│   │   │   ├── cors.go
│   │   │   └── logging.go
│   │   └── routes/
│   │       └── routes.go           # Route definitions
│   ├── domain/
│   │   ├── models/                 # Domain models
│   │   │   ├── salon.go
│   │   │   ├── staff.go
│   │   │   ├── service.go
│   │   │   ├── reservation.go
│   │   │   └── user.go
│   │   └── repositories/           # Repository interfaces
│   │       ├── salon.go
│   │       ├── staff.go
│   │       ├── service.go
│   │       ├── reservation.go
│   │       └── user.go
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── connection.go       # DB connection
│   │   │   └── migrations/         # Migrations
│   │   ├── repositories/           # Repository implementations
│   │   │   ├── salon.go
│   │   │   ├── staff.go
│   │   │   ├── service.go
│   │   │   ├── reservation.go
│   │   │   └── user.go
│   │   └── cache/
│   │       └── redis.go            # Redis operations
│   ├── services/                   # Business logic
│   │   ├── salon.go
│   │   ├── staff.go
│   │   ├── service.go
│   │   ├── reservation.go
│   │   └── auth.go
│   └── config/
│       └── config.go               # Configuration management
├── pkg/
│   ├── logger/                     # Logging functionality
│   ├── validator/                  # Validation
│   └── utils/                      # Utilities
├── docker-compose.yml
├── Dockerfile
├── go.mod
└── go.sum
```

## Database Design

### Table Definitions

#### salons (Beauty salons)
```sql
CREATE TABLE salons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    image_url VARCHAR(500),
    opening_hours JSONB,          -- Business hours (by day of week)
    latitude DECIMAL(10, 8),      -- Latitude
    longitude DECIMAL(11, 8),     -- Longitude
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### staff (Staff members)
```sql
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER NOT NULL REFERENCES salons(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    specialties TEXT[],           -- Specialties
    experience_years INTEGER,
    working_hours JSONB,          -- Working hours (by day of week)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### services (Services/Menu)
```sql
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER NOT NULL REFERENCES salons(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,       -- Price (in yen)
    duration_minutes INTEGER NOT NULL, -- Duration (in minutes)
    category VARCHAR(100),        -- Category (Cut, Color, Perm, etc.)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### users (Users)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    role VARCHAR(20) DEFAULT 'customer', -- customer, admin, staff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### reservations (Reservations)
```sql
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    salon_id INTEGER NOT NULL REFERENCES salons(id),
    staff_id INTEGER NOT NULL REFERENCES staff(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    service_id INTEGER NOT NULL REFERENCES services(id),
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed
    notes TEXT,
    total_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Design

### Authentication
```
POST /api/auth/register         # User registration
POST /api/auth/login           # Login
POST /api/auth/logout          # Logout
GET  /api/auth/me              # Get user information
```

### Beauty Salons
```
GET    /api/salons             # Salon list (with search and filter)
GET    /api/salons/:id         # Salon details
POST   /api/salons             # Create salon (admin only)
PUT    /api/salons/:id         # Update salon (admin only)
DELETE /api/salons/:id         # Delete salon (admin only)
```

### Staff
```
GET    /api/salons/:salon_id/staff        # Staff list
GET    /api/staff/:id                     # Staff details
POST   /api/salons/:salon_id/staff        # Create staff
PUT    /api/staff/:id                     # Update staff
DELETE /api/staff/:id                     # Delete staff
```

### Services
```
GET    /api/salons/:salon_id/services     # Service list
GET    /api/services/:id                  # Service details
POST   /api/salons/:salon_id/services     # Create service
PUT    /api/services/:id                  # Update service
DELETE /api/services/:id                  # Delete service
```

### Reservations
```
GET    /api/reservations                  # Reservation list (by user)
GET    /api/reservations/:id              # Reservation details
POST   /api/reservations                  # Create reservation
PUT    /api/reservations/:id              # Update reservation
DELETE /api/reservations/:id              # Cancel reservation
GET    /api/salons/:salon_id/slots        # Get available time slots
```

## Business Logic

### Reservation System
1. **Available Time Calculation**
   - Staff working hours
   - Existing reservations
   - Service duration consideration

2. **Reservation Validation**
   - Business hours verification
   - Staff working hours verification
   - Double booking prevention
   - Past date/time booking prevention

3. **Reservation Confirmation Process**
   - Availability check
   - Price calculation
   - Notification sending

### Security
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Rate limiting
- Input validation

### Performance
- Database indexing
- Redis caching
- Pagination
- Asynchronous processing

## Error Handling

### Error Response Format
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "There is an issue with the input values",
        "details": [
            {
                "field": "email",
                "message": "Please enter a valid email address"
            }
        ]
    }
}
```

## Logging & Monitoring
- Structured logging (JSON format)
- Access logs
- Error logs
- Performance monitoring

## Deployment & Operations
- Dockerization
- Environment variable configuration
- Health check endpoints
- Graceful shutdown
