import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'order_db',
});

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';

app.use(cors());
app.use(express.json());

// Initialize database tables
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id),
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );
    `);
    console.log('Orders table initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { user_id, items } = req.body; // items: [{product_id, quantity}]
    
    let total_amount = 0;
    
    // Validate products and calculate total
    for (const item of items) {
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${item.product_id}`);
        total_amount += response.data.price * item.quantity;
      } catch (error) {
        return res.status(404).json({ error: `Product ${item.product_id} not found` });
      }
    }
    
    // Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
      [user_id, total_amount, 'pending']
    );
    
    const order = orderResult.rows[0];
    
    // Add order items
    for (const item of items) {
      const priceResult = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${item.product_id}`);
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, priceResult.data.price]
      );
    }
    
    res.status(201).json({
      message: 'Order created successfully',
      order: { ...order, items },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
    
    res.json({ ...order, items: itemsResult.rows });
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Get user orders
app.get('/api/orders/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Order Service is running' });
});

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Order Service listening on port ${PORT}`);
});

export default app;
