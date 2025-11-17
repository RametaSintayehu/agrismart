import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../services/api';

const Checkout = ({ onClose, onOrderSuccess }) => {
  const { items, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress
      };

      // Create order
      const response = await orderAPI.create(orderData);
      
      // Clear cart and show success
      clearCart();
      onOrderSuccess();
      
      alert(`🎉 Order placed successfully! Order #${response.data._id}`);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <p>Add some products before checking out.</p>
            <button onClick={onClose} className="primary-btn">Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal checkout-modal">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="checkout-content">
          {error && <div className="error-message">{error}</div>}

          <div className="checkout-layout">
            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {items.map((item) => (
                  <div key={item.product._id} className="order-item">
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>${item.price} × {item.quantity} {item.product.unit}</p>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-total">
                <strong>Total: ${getCartTotal().toFixed(2)}</strong>
              </div>
            </div>

            {/* Shipping Form */}
            <form onSubmit={handleSubmitOrder} className="shipping-form">
              <h3>Shipping Address</h3>
              
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-actions">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="place-order-btn"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;