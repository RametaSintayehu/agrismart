import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

const UserDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user.role === 'buyer') {
        response = await orderAPI.getMyOrders();
      } else {
        response = await orderAPI.getFarmerOrders();
      }
      
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return { totalOrders, pendingOrders, completedOrders, totalRevenue };
  };

  const stats = getOrderStats();

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
      <div className="user-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {user.name}! 👋</h2>
        <p>Here's your {user.role} dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completedOrders}</h3>
            <p>Completed</p>
          </div>
        </div>

        {user.role === 'farmer' && (
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${stats.totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="orders-section">
        <h3>Recent Orders</h3>
        
        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>No orders yet</p>
            <span>
              {user.role === 'buyer' 
                ? 'Start shopping to see your orders here!'
                : 'Orders from buyers will appear here.'
              }
            </span>
          </div>
        ) : (
          <div className="orders-list">
            {orders.slice(0, 5).map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h4>Order #{order._id.slice(-8)}</h4>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-items">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="order-item-preview">
                        <span>{item.product.name}</span>
                        <span>{item.quantity} {item.product.unit}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="more-items">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>

                  <div className="order-total">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="order-party">
                  {user.role === 'buyer' ? (
                    <span>Farmer: {order.farmer.name}</span>
                  ) : (
                    <span>Buyer: {order.buyer.name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          {user.role === 'buyer' ? (
            <>
              <button className="action-btn primary">
                🛒 Continue Shopping
              </button>
              <button className="action-btn">
                📋 View All Orders
              </button>
            </>
          ) : (
            <>
              <button className="action-btn primary">
                🌱 Add New Product
              </button>
              <button className="action-btn">
                📊 View Analytics
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;