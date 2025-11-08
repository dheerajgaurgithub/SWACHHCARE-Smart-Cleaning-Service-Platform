# SWACHHCARE Database Schema

## Tables

### users
- id (Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- role (Enum: 'customer', 'worker', 'admin')
- createdAt (Timestamp)
- updatedAt (Timestamp)

### customers
- id (Primary Key)
- userId (Foreign Key → users.id)
- phone (String)
- address (String)
- city (String)
- state (String)
- zipcode (String)
- totalSpent (Decimal)
- createdAt (Timestamp)

### workers
- id (Primary Key)
- userId (Foreign Key → users.id)
- phone (String)
- services (JSON Array)
- availability (JSON Object)
- rating (Decimal)
- tasksCompleted (Integer)
- status (Enum: 'Available', 'Busy', 'Offline')
- bankAccount (String)
- createdAt (Timestamp)

### bookings
- id (Primary Key)
- customerId (Foreign Key → customers.id)
- service (String)
- date (Date)
- time (Time)
- address (String)
- package (String)
- status (Enum: 'Pending', 'Confirmed', 'Scheduled', 'Completed', 'Cancelled')
- amount (Decimal)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### tasks
- id (Primary Key)
- bookingId (Foreign Key → bookings.id)
- workerId (Foreign Key → workers.id)
- status (Enum: 'Assigned', 'Confirmed', 'InProgress', 'Completed')
- estimatedTime (Integer)
- actualTime (Integer)
- completedAt (Timestamp)
- createdAt (Timestamp)

### payments
- id (Primary Key)
- bookingId (Foreign Key → bookings.id)
- amount (Decimal)
- method (String)
- status (Enum: 'Pending', 'Success', 'Failed')
- transactionId (String)
- createdAt (Timestamp)

### reviews
- id (Primary Key)
- taskId (Foreign Key → tasks.id)
- customerId (Foreign Key → customers.id)
- workerId (Foreign Key → workers.id)
- rating (Integer 1-5)
- comment (Text)
- createdAt (Timestamp)

### transactions
- id (Primary Key)
- workerId (Foreign Key → workers.id)
- amount (Decimal)
- type (Enum: 'Earning', 'Withdrawal', 'Refund')
- status (Enum: 'Pending', 'Completed')
- relatedBookingId (Foreign Key → bookings.id)
- createdAt (Timestamp)
