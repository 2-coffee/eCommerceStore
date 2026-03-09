import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'payment_db',
});

app.use(cors());
app.use(express.json());

// Initialize database tables
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Payments table initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Process payment
app.post('/api/payments', async (req, res) => {
  try {
    const { order_id, amount, payment_method } = req.body;
    
    // Simulate payment processing
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo
    const status = isSuccess ? 'completed' : 'failed';
    
    const result = await pool.query(
      'INSERT INTO payments (order_id, amount, status, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
      [order_id, amount, status, payment_method]
    );
    
    const response_code = isSuccess ? 201 : 400;
    res.status(response_code).json({
      message: `Payment ${status}`,
      payment: result.rows[0],
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// Get payment by ID
app.get('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Fetch payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Get payments for order
app.get('/api/payments/order/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;
    const result = await pool.query('SELECT * FROM payments WHERE order_id = $1', [order_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch order payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Payment Service is running' });
});

app.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Payment Service listening on port ${PORT}`);
});

export default app;
