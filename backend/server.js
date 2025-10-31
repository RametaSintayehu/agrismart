// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const listingRoutes = require('./routes/listings.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrismart_dev';

mongoose.connect(MONGO_URI)
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB error', err));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

app.get('/api/health', (req,res)=> res.json({ ok: true, time: new Date() }));

app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).json({ error: 'internal server error!'});
});

app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
