import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    console.log('URI:', process.env.MONGO_URI ? 'URI is set (hidden for security)' : 'URI not found');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ SUCCESS: MongoDB Atlas Connected!');
    
    // Test database operations
    const Test = mongoose.model('Test', new mongoose.Schema({ 
      name: String,
      message: String,
      createdAt: { type: Date, default: Date.now }
    }));
    
    // Create a test document
    await Test.create({ 
      name: 'AgriSmart Test', 
      message: 'Database connection successful!' 
    });
    console.log('✅ Test document created!');
    
    // Read the test document
    const results = await Test.find();
    console.log('📊 Database test results:', results);
    
    await mongoose.connection.close();
    console.log('🎉 All tests passed! AgriSmart database is ready.');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('💡 Tips:');
    console.log('   - Check if password is correct (Yoya@2024)');
    console.log('   - Verify IP whitelist in MongoDB Atlas');
    console.log('   - Check network connection');
  }
};

testConnection();
