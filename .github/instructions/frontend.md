# Frontend Implementation Guide

## Technology Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- SWR (Data fetching)
- React Hook Form (Form management)
- date-fns (Date manipulation)

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Homepage
│   │   ├── salons/
│   │   │   ├── page.tsx            # Salon list
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Salon details
│   │   │       └── booking/
│   │   │           └── page.tsx    # Booking page
│   │   ├── reservations/
│   │   │   └── page.tsx            # Reservation management
│   │   └── admin/
│   │       ├── page.tsx            # Admin dashboard
│   │       ├── salons/
│   │       │   └── page.tsx        # Salon management
│   │       ├── staff/
│   │       │   └── page.tsx        # Staff management
│   │       └── reservations/
│   │           └── page.tsx        # Reservation management
│   ├── components/
│   │   ├── ui/                     # Basic UI components
│   │   ├── salon/                  # Salon-related components
│   │   ├── booking/                # Booking-related components
│   │   └── admin/                  # Admin dashboard components
│   ├── lib/
│   │   ├── api.ts                  # API functions
│   │   ├── types.ts                # Type definitions
│   │   └── utils.ts                # Utility functions
│   └── hooks/                      # Custom hooks
├── public/
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Features to Implement

### 1. User Features
- Salon search and listing
- Salon detail information display
- Service and menu display
- Staff introduction
- Booking calendar display
- Available time slots check
- Booking form
- Reservation confirmation, modification, and cancellation

### 2. Admin Features
- Salon information management
- Staff management
- Service and menu management
- Business hours configuration
- Reservation management (confirmation, modification, cancellation)
- Sales report display

## Component Design

### UI Components (components/ui/)
- Button
- Input
- Select
- Modal
- Card
- Badge
- Calendar
- TimePicker

### Salon Components (components/salon/)
- SalonCard
- SalonDetail
- ServiceMenu
- StaffList

### Booking Components (components/booking/)
- BookingCalendar
- TimeSlots
- BookingForm
- ReservationCard

### Admin Components (components/admin/)
- SalonManagement
- StaffManagement
- ReservationManagement

## Design Guidelines

### Color Palette
```css
primary: #e91e63     /* Pink */
secondary: #9c27b0   /* Purple */
accent: #ff5722      /* Orange */
neutral: #f5f5f5     /* Gray */
success: #4caf50     /* Green */
warning: #ff9800     /* Orange */
error: #f44336       /* Red */
```

### Responsive Design
- Mobile First
- Breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px)

### Accessibility
- Semantic HTML
- Proper use of ARIA attributes
- Keyboard navigation support
- Appropriate contrast ratios

## API Integration

### Endpoints
```
GET /api/salons              # Salon list
GET /api/salons/:id          # Salon details
GET /api/salons/:id/staff    # Staff list
GET /api/salons/:id/services # Service list
GET /api/salons/:id/slots    # Available time slots
POST /api/reservations       # Create reservation
GET /api/reservations/:id    # Reservation details
PUT /api/reservations/:id    # Update reservation
DELETE /api/reservations/:id # Cancel reservation
```

### Error Handling
- Appropriate error message display
- Loading state display
- Offline support

## Performance
- Image optimization
- Code splitting
- Cache strategy
- SEO optimization
