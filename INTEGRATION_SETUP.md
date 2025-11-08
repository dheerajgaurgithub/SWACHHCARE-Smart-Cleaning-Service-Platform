# SwachhCare Backend-Frontend Integration Guide

## Complete Integration Overview

This guide covers the full integration of the SwachhCare backend and frontend systems.

### What's Integrated

#### 1. **API Client Layer** (`lib/api-client.ts`)
- Centralized HTTP client with automatic token handling
- Built-in error management
- Support for GET, POST, PUT, DELETE, PATCH methods
- Automatic authorization header injection

#### 2. **Authentication System** (`hooks/use-auth.tsx`)
- Integrated with backend auth endpoints
- Automatic token management via localStorage
- Auth state persistence on app reload
- Role-based routing (customer, worker, admin)
- Login, signup, logout functionality

#### 3. **API Endpoints** (all in `lib/api/`)
- **authAPI**: Register, login, OTP, password reset
- **userAPI**: Profile, wallet, addresses, notifications
- **bookingAPI**: Create, update, assign, feedback
- **paymentAPI**: Razorpay orders, verification, earnings
- **workerAPI**: Profile, availability, attendance, payouts
- **adminAPI**: Dashboard stats, worker management, transactions

#### 4. **Real-Time Features** (Socket.io)
- Live chat messaging with typing indicators
- Notifications system
- Worker location tracking ready
- Booking status updates
- Customizable Socket.io events

#### 5. **Payment Integration** (Razorpay)
- Order creation through API
- Payment verification with signature check
- Wallet management
- Transaction history

#### 6. **Dashboard Updates**
- Customer dashboard with booking stats and wallet
- Worker dashboard with earnings and task management
- Admin dashboard with platform analytics

---

## Installation & Setup

### Frontend Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables** (`.env.local`)
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
   \`\`\`

3. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

### Backend Setup

1. **Install Dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

2. **Environment Variables** (`backend/.env`)
   \`\`\`env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   NODE_ENV=development
   \`\`\`

3. **Start Backend Server**
   \`\`\`bash
   npm run dev
   \`\`\`

---

## API Client Usage

### Using API Client Directly

\`\`\`typescript
import { apiClient } from "@/lib/api-client"

// GET request
const data = await apiClient.get("/endpoint")

// POST request
const result = await apiClient.post("/endpoint", { data })

// PUT request
const updated = await apiClient.put("/endpoint", { data })

// DELETE request
await apiClient.delete("/endpoint")
\`\`\`

### Using Specific API Modules

\`\`\`typescript
import { authAPI } from "@/lib/api/auth-api"
import { bookingAPI } from "@/lib/api/booking-api"
import { userAPI } from "@/lib/api/user-api"

// Authentication
await authAPI.login(email, password)
await authAPI.register(userData)

// Bookings
const bookings = await bookingAPI.getCustomerBookings()
await bookingAPI.createBooking(bookingData)

// Users
const profile = await userAPI.getProfile()
await userAPI.updateProfile(updates)
\`\`\`

### Using Custom Hook

\`\`\`typescript
import { useAPI } from "@/lib/hooks/use-api"
import { bookingAPI } from "@/lib/api/booking-api"

function MyComponent() {
  const { data, loading, error, execute } = useAPI(
    () => bookingAPI.getCustomerBookings(),
    {
      onSuccess: (data) => console.log("Loaded:", data),
      autoExecute: true
    }
  )

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
    </div>
  )
}
\`\`\`

---

## Authentication Flow

1. **User Signs Up**
   - User fills signup form with role selection
   - `authAPI.register()` is called
   - Backend creates user and returns JWT token
   - Token stored in localStorage
   - User redirected to dashboard

2. **User Logs In**
   - User enters credentials
   - `authAPI.login()` is called
   - Backend validates and returns token
   - Token stored, user redirected to dashboard

3. **Protected Routes**
   - Each dashboard checks `isAuthenticated` and role
   - If not authenticated, redirects to login
   - If wrong role, redirects accordingly

4. **Auth Persistence**
   - On app load, `useAuth` checks for token in localStorage
   - Calls `authAPI.getCurrentUser()` to verify and get user data
   - Sets user context if valid

---

## Socket.io Real-Time Features

### Using Socket.io Hook

\`\`\`typescript
import { useSocket } from "@/lib/hooks/use-socket"
import { socketEvents } from "@/lib/socket-client"

function ChatComponent() {
  const { emit, on, off } = useSocket()

  useEffect(() => {
    // Listen for incoming messages
    on(socketEvents.RECEIVE_MESSAGE, (message) => {
      console.log("New message:", message)
    })

    // Send message
    const sendMessage = () => {
      emit(socketEvents.SEND_MESSAGE, {
        conversationId: "123",
        message: "Hello!"
      })
    }

    return () => {
      off(socketEvents.RECEIVE_MESSAGE)
    }
  }, [])
}
\`\`\`

### Available Socket Events

\`\`\`typescript
// Chat
SEND_MESSAGE
RECEIVE_MESSAGE
TYPING
STOP_TYPING

// Notifications
SEND_NOTIFICATION
RECEIVE_NOTIFICATION

// Bookings
BOOKING_UPDATE
WORKER_LOCATION
BOOKING_STATUS

// Availability
WORKER_AVAILABLE
WORKER_UNAVAILABLE
\`\`\`

---

## Payment Integration (Razorpay)

### Creating an Order

\`\`\`typescript
import { paymentAPI } from "@/lib/api/payment-api"

const orderData = await paymentAPI.createOrder(
  amountInPaisa,
  customerId
)
// Returns: { orderId, amount, currency }
\`\`\`

### Verifying Payment

\`\`\`typescript
const verification = await paymentAPI.verifyPayment(
  orderId,
  paymentId,
  signature
)
\`\`\`

### Full Payment Example

\`\`\`typescript
import PaymentHandler from "@/components/payment/payment-handler"

function BookingPage() {
  return (
    <PaymentHandler
      amount={1999}
      bookingId="booking-123"
      onSuccess={(paymentId) => {
        console.log("Payment successful:", paymentId)
        // Redirect to confirmation
      }}
      onError={(error) => {
        console.log("Payment failed:", error)
      }}
    />
  )
}
\`\`\`

---

## Data Flow Examples

### Booking Creation Flow

\`\`\`
1. User fills booking form
2. Form submission calls bookingAPI.createBooking()
3. API client adds auth token and sends to backend
4. Backend validates and creates booking
5. Returns booking data with ID
6. Frontend redirects to booking details
7. Socket.io notifies worker of new booking
8. Real-time update in worker's task list
\`\`\`

### Payment Flow

\`\`\`
1. User clicks "Pay" on wallet page
2. PaymentHandler component initiates Razorpay
3. User completes payment in Razorpay UI
4. Razorpay returns payment ID and signature
5. Frontend calls paymentAPI.verifyPayment()
6. Backend verifies signature with Razorpay
7. If valid, calls userAPI.addWalletBalance()
8. Wallet updated and reflected in UI
\`\`\`

### Dashboard Data Flow

\`\`\`
1. Dashboard component mounts
2. useEffect runs, checks authentication
3. If authenticated, calls API endpoints:
   - bookingAPI.getCustomerBookings()
   - userAPI.getWallet()
4. API client adds auth token automatically
5. Backend returns data
6. State updated with results
7. UI re-renders with data
\`\`\`

---

## Error Handling

All API calls include automatic error handling:

\`\`\`typescript
try {
  const data = await bookingAPI.getCustomerBookings()
} catch (error) {
  console.error({
    status: error.status,      // HTTP status code
    message: error.message,    // Error message
    data: error.data          // Full response data
  })
}
\`\`\`

### Common Error Codes

- `401` - Unauthorized (expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

---

## Testing the Integration

### 1. Test Authentication
- Go to `/auth/login`
- Enter credentials (backend must have user)
- Should redirect to `/customer/dashboard`

### 2. Test API Calls
- Open DevTools Network tab
- Navigate dashboards
- Check API requests in Network tab
- Verify Authorization header is present

### 3. Test Real-Time (Chat)
- Open two browser windows
- Log in as different users
- Send message in one window
- Should appear in other window in real-time

### 4. Test Payment
- Go to `/customer/payment`
- Click "Add Money"
- Complete test payment in Razorpay
- Wallet should be updated

---

## Troubleshooting

### "API not responding"
- Check if backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### "Socket.io not connecting"
- Verify `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
- Check if Socket.io is enabled in backend
- Look for connection errors in console

### "Token issues/401 errors"
- Check if token is stored in localStorage
- Verify token hasn't expired
- Try logging out and logging back in

### "Razorpay not loading"
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Check if Razorpay script loaded in Network tab
- Ensure key is for correct environment (test/live)

---

## Project Structure

\`\`\`
frontend/
├── app/
│   ├── auth/          # Authentication pages
│   ├── customer/      # Customer dashboards
│   ├── worker/        # Worker dashboards
│   ├── admin/         # Admin dashboards
│   └── api/           # Next.js API routes
├── components/
│   ├── layout/        # Navigation, footer
│   ├── chat/          # Chat components
│   ├── payment/       # Payment components
│   └── notifications/ # Notification center
├── lib/
│   ├── api-client.ts        # HTTP client
│   ├── socket-client.ts     # Socket.io setup
│   ├── api/                 # API endpoints
│   └── hooks/               # Custom hooks
└── hooks/
    ├── use-auth.tsx    # Auth context
    └── use-socket.ts   # Socket.io hook

backend/
├── src/
│   ├── config/        # Database, JWT, Razorpay
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── controllers/   # Route handlers
│   ├── services/      # Business logic
│   ├── middlewares/   # Auth, validation
│   ├── validators/    # Joi schemas
│   ├── socket/        # Socket.io handlers
│   ├── jobs/          # Cron jobs
│   └── utils/         # Utilities
└── server.js          # Express app
\`\`\`

---

## Next Steps

1. **Database Setup**: Connect MongoDB and run migrations
2. **Environment Variables**: Set all required env vars in both frontend and backend
3. **Testing**: Test all major flows (auth, booking, payment)
4. **Deployment**: Deploy backend to Render/Railway, frontend to Vercel
5. **Monitoring**: Set up error tracking and monitoring

---

## Support

For issues or questions:
1. Check error messages in browser console
2. Check backend logs for API errors
3. Verify environment variables are set correctly
4. Check network requests in DevTools
