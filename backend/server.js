const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔗 Connecting to MongoDB Atlas...');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is required in environment variables');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ AgriSmart successfully connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('❌ MongoDB Atlas connection failed:', error.message);
  process.exit(1);
});

// ========== ALL ROUTES DEFINED DIRECTLY ==========

// Basic routes
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
    status: dbStatus === 'connected' ? 'OK' : 'ERROR',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Farmers API Routes
app.get('/api/farmers', (req, res) => {
  res.json({ 
    message: 'Farmers list retrieved successfully',
    data: [
      { id: 1, name: 'John Farmer', location: 'Nairobi', crops: ['Maize', 'Beans'] },
      { id: 2, name: 'Mary Agric', location: 'Kisumu', crops: ['Rice', 'Vegetables'] }
    ],
    count: 2
  });
});

app.get('/api/farmers/:id', (req, res) => {
  const farmerId = req.params.id;
  res.json({ 
    message: `Farmer ${farmerId} details`,
    data: { 
      id: farmerId, 
      name: 'Sample Farmer', 
      location: 'Sample Location',
      contact: 'sample@email.com'
    }
  });
});

app.post('/api/farmers', (req, res) => {
  res.json({ 
    message: 'Farmer created successfully',
    data: { id: 3, ...req.body }
  });
});

// Crops API Routes
app.get('/api/crops', (req, res) => {
  res.json({ 
    message: 'Crops list retrieved successfully',
    data: [
      { id: 1, name: 'Maize', season: 'Rainy', yield: 'Good' },
      { id: 2, name: 'Beans', season: 'Rainy', yield: 'Excellent' },
      { id: 3, name: 'Wheat', season: 'Dry', yield: 'Average' }
    ],
    count: 3
  });
});

app.get('/api/crops/:id', (req, res) => {
  const cropId = req.params.id;
  res.json({ 
    message: `Crop ${cropId} details`,
    data: { 
      id: cropId, 
      name: 'Sample Crop', 
      plantingSeason: 'Rainy',
      harvestTime: '3 months'
    }
  });
});

// Weather API Routes
app.get('/api/weather', (req, res) => {
  res.json({
    message: 'Weather data for farming',
    data: {
      temperature: 25,
      humidity: 65,
      rainfall: 'Moderate',
      forecast: 'Good for planting'
    }
  });
});

// Market Prices API Routes
app.get('/api/market-prices', (req, res) => {
  res.json({
    message: 'Current market prices',
    data: [
      { crop: 'Maize', price: 50, unit: 'kg' },
      { crop: 'Beans', price: 80, unit: 'kg' },
      { crop: 'Rice', price: 120, unit: 'kg' }
    ]
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /health', 
      'GET /api/farmers',
      'GET /api/farmers/:id',
      'POST /api/farmers',
      'GET /api/crops',
      'GET /api/crops/:id',
      'GET /api/weather',
      'GET /api/market-prices'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AgriSmart backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
  console.log(`✅ All routes defined directly - no external imports`);
});


