# SWACHHCARE API Documentation

## Authentication Endpoints

### Register User
- **POST** `/api/auth/register`
- Body: `{ name, email, password, role }`
- Response: User object with ID

### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Response: User object with auth token

## Booking Endpoints

### Get Bookings
- **GET** `/api/bookings?userId=xxx`
- Response: Array of bookings

### Create Booking
- **POST** `/api/bookings`
- Body: `{ customerId, service, date, time, address, package }`
- Response: Booking object

### Get Booking Details
- **GET** `/api/bookings/[id]`
- Response: Single booking object

### Update Booking
- **PUT** `/api/bookings/[id]`
- Body: `{ status }`
- Response: Updated booking object

## Task Endpoints

### Get Tasks
- **GET** `/api/tasks?workerId=xxx&status=xxx`
- Response: Array of tasks

### Create Task
- **POST** `/api/tasks`
- Body: `{ bookingId, workerId, estimatedTime }`
- Response: Task object

### Get Task Details
- **GET** `/api/tasks/[id]`
- Response: Single task object

### Update Task
- **PUT** `/api/tasks/[id]`
- Body: `{ status, completedAt }`
- Response: Updated task object

## Worker Endpoints

### Get Workers
- **GET** `/api/workers?service=xxx&minRating=x.x`
- Response: Array of workers

### Create Worker Profile
- **POST** `/api/workers`
- Body: `{ userId, services, availability }`
- Response: Worker profile object

## Analytics Endpoints

### Get Analytics
- **GET** `/api/analytics?period=month`
- Response: Analytics data object

## Payment Endpoints

### Process Payment
- **POST** `/api/payment`
- Body: `{ bookingId, amount, method }`
- Response: Payment object with transaction ID

## Error Responses

All endpoints return error responses in the format:
\`\`\`json
{
  "error": "Error message"
}
\`\`\`

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Server Error
