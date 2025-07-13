import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
