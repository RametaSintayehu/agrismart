import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas Connected Successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
  }
};

connectDB();

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running 🚀',
    database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'AgriSmart Backend API is working!',
    endpoints: {
      health: '/api/health',
      root: '/'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AgriSmart Server running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`📡 Network: http://0.0.0.0:${PORT}`);
  console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);
});

// Handle server errors
app.on('error', (error) => {
  console.log('❌ Server error:', error);
});
