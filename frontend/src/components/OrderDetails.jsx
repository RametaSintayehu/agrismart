import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const OrderDetails = ({ orderId, user, onClose, onStatusUpdate }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders(); // We'll need to adjust API for single order
      const foundOrder = response.data.find(o => o._id === orderId);
      setOrder(foundOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      await orderAPI.updateStatus(orderId, newStatus);
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      fetchOrder(); // Refresh order data
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#2196f3',
      shipped: '#673ab7',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="error-state">
            <h3>Order not found</h3>
            <button onClick={onClose} className="primary-btn">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal order-details-modal">
        <div className="order-details-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="order-details-content">
          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-meta">
              <div className="meta-item">
                <strong>Order ID:</strong>
                <span>#{order._id.slice(-8)}</span>
              </div>
              <div className="meta-item">
                <strong>Order Date:</strong>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <strong>Status:</strong>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Parties */}
            <div className="order-parties">
              <div className="party-info">
                <h4>{user.role === 'buyer' ? 'Farmer' : 'Buyer'}</h4>
                <p>{user.role === 'buyer' ? order.farmer.name : order.buyer.name}</p>
                <p>{user.role === 'buyer' ? order.farmer.email : order.buyer.email}</p>
              </div>
              
              <div className="party-info">
                <h4>Shipping Address</h4>
                {order.shippingAddress ? (
                  <>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  </>
                ) : (
                  <p>No shipping address provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <div className="item-image">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <div className="image-placeholder">🌱</div>
                    )}
                  </div>
                  
                  <div className="item-info">
                    <h4>{item.product.name}</h4>
                    <p className="item-category">{item.product.category}</p>
                  </div>
                  
                  <div className="item-quantity">
                    {item.quantity} {item.product.unit}
                  </div>
                  
                  <div className="item-price">
                    ${item.price} / {item.product.unit}
                  </div>
                  
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="order-total-section">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Status Update (for farmers) */}
          {user.role === 'farmer' && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="status-update-section">
              <h4>Update Order Status</h4>
              <div className="status-buttons">
                {['confirmed', 'shipped', 'delivered'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={updating || order.status === status}
                    className="status-btn"
                  >
                    {updating ? 'Updating...' : `Mark as ${status}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;