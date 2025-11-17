import React from 'react';
import AddToCartButton from './AddToCartButton';

const ProductList = ({ products, showFarmerInfo = true, user }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-list empty">
        <p>No products available yet.</p>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      vegetables: '🥦',
      fruits: '🍎',
      grains: '🌾',
      dairy: '🥛',
      livestock: '🐄',
      other: '🌱'
    };
    return icons[category] || '🌱';
  };

  return (
    <div className="product-list">
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card enhanced">
            <div className="product-header">
              <span className="category-icon">
                {getCategoryIcon(product.category)}
              </span>
              <h3>{product.name}</h3>
              {product.organic && <span className="organic-badge">🌱 Organic</span>}
            </div>
            
            {product.description && (
              <p className="description">{product.description}</p>
            )}
            
            <div className="product-pricing">
              <span className="price">${product.price}</span>
              <span className="unit">/{product.unit}</span>
            </div>
            
            <div className="product-details">
              <div className="detail-item">
                <span className="label">Available:</span>
                <span className="value">{product.quantity} {product.unit}</span>
              </div>
              
              <div className="detail-item">
                <span className="label">Category:</span>
                <span className="value category-tag">{product.category}</span>
              </div>
            </div>

            {showFarmerInfo && product.farmer && (
              <div className="farmer-info">
                <div className="farmer-avatar">👨‍🌾</div>
                <div className="farmer-details">
                  <span className="farmer-name">By {product.farmer.name}</span>
                  {product.location && (product.location.city || product.location.state) && (
                    <span className="farmer-location">
                      {product.location.city} {product.location.state && `, ${product.location.state}`}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="product-meta">
              <small>Added {new Date(product.createdAt).toLocaleDateString()}</small>
            </div>

            <button className="contact-farmer-btn">
              Contact Farmer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;