import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lb', 'piece', 'bunch', 'bag'],
    default: 'kg'
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'livestock', 'other']
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: String,
    state: String
  },
  organic: {
    type: Boolean,
    default: false
  },
  images: [String]
}, {
  timestamps: true
});

// Export the model properly
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export { Product };
export default Product;