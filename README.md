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

### 2. Product Service 
- Product catalog management
- Stock tracking
- **Endpoints:**
  - `GET /api/products` - List all products
  - `GET /api/products/:id` - Get product details
  - `POST /api/products` - Create product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product

### 3. Order Service
- Order creation and management
- Integration with Product Service
- **Endpoints:**
  - `POST /api/orders` - Create order
  - `GET /api/orders/:id` - Get order details
  - `GET /api/orders/user/:user_id` - Get user orders
  - `PATCH /api/orders/:id/status` - Update order status

### 4. Payment Service 
- Payment processing
- Payment history tracking
- **Endpoints:**
  - `POST /api/payments` - Process payment
  - `GET /api/payments/:id` - Get payment details
  - `GET /api/payments/order/:order_id` - Get payments for order

