import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';

const AnalyticsDashboard = ({ user }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getFarmerAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-dashboard">
        <div className="error-state">
          <h3>Unable to load analytics</h3>
          <p>Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="analytics-overview">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>${analytics.overview.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <h3>{analytics.overview.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="metric-card completed">
          <div className="metric-icon">✅</div>
          <div className="metric-info">
            <h3>{analytics.overview.completedOrders}</h3>
            <p>Completed Orders</p>
          </div>
        </div>

        <div className="metric-card pending">
          <div className="metric-icon">⏳</div>
          <div className="metric-info">
            <h3>{analytics.overview.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="analytics-section">
        <h3>Top Performing Products</h3>
        <div className="products-performance">
          {analytics.productPerformance.map((product, index) => (
            <div key={index} className="performance-item">
              <div className="product-info">
                <h4>{product.productName}</h4>
                <span className="product-category">{product.category}</span>
              </div>
              <div className="performance-stats">
                <div className="stat">
                  <span className="label">Sold:</span>
                  <span className="value">{product.totalSold}</span>
                </div>
                <div className="stat">
                  <span className="label">Revenue:</span>
                  <span className="value">${product.totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Customers */}
      <div className="analytics-section">
        <h3>Top Customers</h3>
        <div className="top-customers">
          {analytics.topCustomers.map((customer, index) => (
            <div key={index} className="customer-card">
              <div className="customer-avatar">
                {customer.buyerName.charAt(0).toUpperCase()}
              </div>
              <div className="customer-info">
                <h4>{customer.buyerName}</h4>
                <p>{customer.orderCount} orders</p>
              </div>
              <div className="customer-spending">
                ${customer.totalSpent.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart (Simple) */}
      <div className="analytics-section">
        <h3>Revenue Trend</h3>
        <div className="revenue-chart">
          {analytics.revenueData.length > 0 ? (
            <div className="chart-bars">
              {analytics.revenueData.slice(-7).map((day, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(day.revenue / Math.max(...analytics.revenueData.map(d => d.revenue))) * 100}%` 
                    }}
                  ></div>
                  <div className="chart-label">
                    ${day.revenue.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No revenue data available for the selected period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;