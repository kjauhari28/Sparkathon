import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import skuRoutes from './routes/skus.js';
import storeRoutes from './routes/stores.js';
import storeSkuRoutes from './routes/store-skus.js';
import salesDataRoutes from './routes/sales-data.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Register simple GET routes before body parsers to avoid parsing empty GET bodies
// (moved express.json/urlencoded further down)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Test Supabase connection
app.get('/test-db', async (req, res) => {
  try {
    const { supabase } = await import('./db/index.js');
    
    // Test the connection by trying to get the current user
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: error.message 
      });
    }
    
    res.json({ 
      message: 'Database connection successful',
      supabase_connected: true
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message 
    });
  }
});

// Simple test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route works!' });
});

app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'POST API test route works!', 
    received: req.body 
  });
});

// Body parsers for API routes, skipping GET requests to prevent parsing empty bodies
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') return next();
  express.json()(req, res, next);
});
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') return next();
  express.urlencoded({ extended: true })(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skus', skuRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/store-skus', storeSkuRoutes);
app.use('/api/sales-data', salesDataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Return error message only
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
