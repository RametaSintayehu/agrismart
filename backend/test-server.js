const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Testing new MongoDB Atlas connection...');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔗 Connection string:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('🎉 SUCCESS: Connected to new AgriSmart cluster!');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🏠 Host:', mongoose.connection.host);
  console.log('✅ Cluster is working perfectly!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ FAILED: Connection error:');
  console.error('   Message:', error.message);
  console.error('   Code:', error.code);
  console.error('');
  console.error('🔧 Troubleshooting steps:');
  console.error('   1. Check MongoDB Atlas → Network Access → Add IP 0.0.0.0/0');
  console.error('   2. Verify username/password in connection string');
  console.error('   3. Check if database user has read/write permissions');
  process.exit(1);
});
