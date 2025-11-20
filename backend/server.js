import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));

// SIMPLE TEST ROUTE
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Hello! Server is working! 🎉',
    status: 'OK',
    time: new Date().toISOString()
  });
});

// ANOTHER SIMPLE ROUTE
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to AgriSmart! 🌱',
    description: 'Your farm management system'
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 SERVER STARTED SUCCESSFULLY!');
  console.log('=================================');
  console.log(`📍 Local:  http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📍 Home:   http://localhost:${PORT}/`);
  console.log('=================================');
});
