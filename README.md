# E-Commerce Microservices

A TypeScript-based microservices architecture for an e-commerce platform with 4 independent services.

## Services

### 1. User Service (Port 3001)
- User registration and authentication
- JWT token generation
- User profile management
- **Endpoints:**
  - `POST /api/users/register` - Register new user
  - `POST /api/users/login` - User login
  - `GET /api/users/:id` - Get user profile

### 2. Product Service (Port 3002)
- Product catalog management
- Stock tracking
- **Endpoints:**
  - `GET /api/products` - List all products
  - `GET /api/products/:id` - Get product details
  - `POST /api/products` - Create product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product

### 3. Order Service (Port 3003)
- Order creation and management
- Integration with Product Service
- **Endpoints:**
  - `POST /api/orders` - Create order
  - `GET /api/orders/:id` - Get order details
  - `GET /api/orders/user/:user_id` - Get user orders
  - `PATCH /api/orders/:id/status` - Update order status

### 4. Payment Service (Port 3004)
- Payment processing
- Payment history tracking
- **Endpoints:**
  - `POST /api/payments` - Process payment
  - `GET /api/payments/:id` - Get payment details
  - `GET /api/payments/order/:order_id` - Get payments for order

## Database

Each service has its own PostgreSQL database (user_db, product_db, order_db, payment_db)

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Running with Docker

1. Start all services:
```bash
docker-compose up --build
```

2. Services will be available at:
   - User Service: http://localhost:3001
   - Product Service: http://localhost:3002
   - Order Service: http://localhost:3003
   - Payment Service: http://localhost:3004

### Running Locally

1. Install dependencies for each service:
```bash
cd services/user-service && npm install
cd services/product-service && npm install
cd services/order-service && npm install
cd services/payment-service && npm install
```

2. Set up PostgreSQL and create databases:
```sql
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE payment_db;
```

3. Update `.env` files in each service to point to your PostgreSQL instance

4. Start each service:
```bash
cd services/user-service && npm run dev
cd services/product-service && npm run dev
cd services/order-service && npm run dev
cd services/payment-service && npm run dev
```

## API Examples

### Register User
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Products
```bash
curl http://localhost:3002/api/products
```

### Create Order
```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"items":[{"product_id":1,"quantity":2}]}'
```

### Process Payment
```bash
curl -X POST http://localhost:3004/api/payments \
  -H "Content-Type: application/json" \
  -d '{"order_id":1,"amount":1999.98,"payment_method":"credit_card"}'
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│               Docker Compose Network                 │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ User Service │  │Product Service│  │Order Service│ │
│  │   :3001      │  │    :3002      │  │   :3003    │ │
│  └──────┬───────┘  └──────┬────────┘  └─────┬──────┘ │
│         │                 │                  │        │
│  ┌──────────────────────────────────┐  ┌────────┐  │
│  │                                  │  │Payment  │  │
│  │        PostgreSQL (Single)      │  │Service  │  │
│  │      Multi-Database Instance    │  │:3004    │  │
│  │                                  │  └────────┘  │
│  └──────────────────────────────────┘             │
└─────────────────────────────────────────────────────┘
```

## Technology Stack

- **Runtime:** Node.js 18
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Container:** Docker & Docker Compose
- **Authentication:** JWT
- **Password Hashing:** bcryptjs

## Next Steps

- Add API Gateway for routing requests
- Implement message queue (RabbitMQ/Kafka) for async communication
- Add logging and monitoring (ELK Stack, Prometheus)
- Implement caching layer (Redis)
- Add unit and integration tests
- Implement CI/CD pipeline
- Add request validation middleware
- Implement error handling and retry logic
