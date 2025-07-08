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
  res.json({ message: 'Simple server is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Simple test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'POST test route works!', 
    received: req.body 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Simple server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
});
