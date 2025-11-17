import React, { useState } from 'react';
import { productAPI } from '../services/api';

const CreateProduct = ({ onProductCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category: 'vegetables',
    organic: false,
    location: { city: '', state: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'city' || name === 'state') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [name]: value
        }
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert price and quantity to numbers
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      const response = await productAPI.create(productData);
      setSuccess('Product created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: 'kg',
        category: 'vegetables',
        organic: false,
        location: { city: '', state: '' }
      });

      if (onProductCreated) {
        onProductCreated(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product">
      <h2>Add New Product</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Fresh Tomatoes"
            />
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
              <option value="livestock">Livestock</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe your product..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price per Unit *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
              placeholder="0"
            />
          </div>
          
          <div className="form-group">
            <label>Unit *</label>
            <select name="unit" value={formData.unit} onChange={handleChange} required>
              <option value="kg">Kilogram (kg)</option>
              <option value="lb">Pound (lb)</option>
              <option value="piece">Piece</option>
              <option value="bunch">Bunch</option>
              <option value="bag">Bag</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="Your city"
            />
          </div>
          
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.location.state}
              onChange={handleChange}
              placeholder="Your state"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="organic"
              checked={formData.organic}
              onChange={handleChange}
            />
            Organic Product
          </label>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding Product...' : 'Add Product to Marketplace'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;