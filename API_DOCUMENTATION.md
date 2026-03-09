# E-Commerce Microservices API Documentation

## Base URLs
- User Service: `http://localhost:3001`
- Product Service: `http://localhost:3002`
- Order Service: `http://localhost:3003`
- Payment Service: `http://localhost:3004`

---

## User Service API

### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Get User Profile
```
GET /api/users/:id

Response (200):
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Health Check
```
GET /health

Response (200):
{
  "status": "User Service is running"
}
```

---

## Product Service API

### List All Products
```
GET /api/products

Response (200):
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High performance laptop",
    "price": "999.99",
    "stock_quantity": 50,
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Mouse",
    "description": "Wireless mouse",
    "price": "29.99",
    "stock_quantity": 200,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Product by ID
```
GET /api/products/:id

Response (200):
{
  "id": 1,
  "name": "Laptop",
  "description": "High performance laptop",
  "price": "999.99",
  "stock_quantity": 50,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "name": "Headphones",
  "description": "Noise-cancelling headphones",
  "price": 199.99,
  "stock_quantity": 100
}

Response (201):
{
  "id": 4,
  "name": "Headphones",
  "description": "Noise-cancelling headphones",
  "price": "199.99",
  "stock_quantity": 100,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Laptop Pro",
  "description": "Updated high performance laptop",
  "price": 1099.99,
  "stock_quantity": 45
}

Response (200):
{
  "id": 1,
  "name": "Laptop Pro",
  "description": "Updated high performance laptop",
  "price": "1099.99",
  "stock_quantity": 45,
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Delete Product
```
DELETE /api/products/:id

Response (200):
{
  "message": "Product deleted successfully"
}
```

### Health Check
```
GET /health

Response (200):
{
  "status": "Product Service is running"
}
```

---

## Order Service API

### Create Order
```
POST /api/orders
Content-Type: application/json

{
  "user_id": 1,
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 2, "quantity": 1}
  ]
}

Response (201):
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "user_id": 1,
    "total_amount": "2059.97",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z",
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 2, "quantity": 1}
    ]
  }
}
```

### Get Order by ID
```
GET /api/orders/:id

Response (200):
{
  "id": 1,
  "user_id": 1,
  "total_amount": "2059.97",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z",
  "items": [
    {
      "id": 1,
      "order_id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": "999.99"
    },
    {
      "id": 2,
      "order_id": 1,
      "product_id": 2,
      "quantity": 1,
      "price": "29.99"
    }
  ]
}
```

### Get User Orders
```
GET /api/orders/user/:user_id

Response (200):
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": "2059.97",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### Update Order Status
```
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "shipped"
}

Response (200):
{
  "id": 1,
  "user_id": 1,
  "total_amount": "2059.97",
  "status": "shipped",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Health Check
```
GET /health

Response (200):
{
  "status": "Order Service is running"
}
```

---

## Payment Service API

### Process Payment
```
POST /api/payments
Content-Type: application/json

{
  "order_id": 1,
  "amount": 2059.97,
  "payment_method": "credit_card"
}

Response (201 or 400):
{
  "message": "Payment completed/failed",
  "payment": {
    "id": 1,
    "order_id": 1,
    "amount": "2059.97",
    "status": "completed",
    "payment_method": "credit_card",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get Payment by ID
```
GET /api/payments/:id

Response (200):
{
  "id": 1,
  "order_id": 1,
  "amount": "2059.97",
  "status": "completed",
  "payment_method": "credit_card",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Get Payments for Order
```
GET /api/payments/order/:order_id

Response (200):
[
  {
    "id": 1,
    "order_id": 1,
    "amount": "2059.97",
    "status": "completed",
    "payment_method": "credit_card",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### Health Check
```
GET /health

Response (200):
{
  "status": "Payment Service is running"
}
```

---

## Error Responses

All services follow a consistent error response format:

```
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Service Communication Flow

1. **User Registration:** User Service handles registration
2. **Product Discovery:** Product Service serves product information
3. **Order Creation:** Order Service calls Product Service to validate products
4. **Payment Processing:** Payment Service processes payments for orders

## Example Flow

```
1. POST /api/users/register (User Service)
   → User created, returns user ID

2. GET /api/products (Product Service)
   → Get available products

3. POST /api/orders (Order Service)
   → Creates order with user_id and items
   → Validates products with Product Service
   → Returns order

4. POST /api/payments (Payment Service)
   → Process payment for the order
   → Returns payment status
```
