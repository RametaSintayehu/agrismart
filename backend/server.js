const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🌱 AgriSmart Backend Starting...');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing');
  process.exit(1);
}

console.log('🔗 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ Connected to AgriSmart MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('🔄 Starting server without database...');
});

// Routes
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    message: '🌱 AgriSmart Backend API is running!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/farmers', (req, res) => {
  res.json({ 
    message: 'Farmers API',
    data: [
      { id: 1, name: 'John Farmer', location: 'Nairobi' },
      { id: 2, name: 'Mary Agric', location: 'Kisumu' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AgriSmart backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});



