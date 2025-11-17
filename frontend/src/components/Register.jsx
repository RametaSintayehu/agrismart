import React from 'react';

const ProductList = ({ products, showFarmerInfo = true }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-list empty">
        <p>No products available yet.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Marketplace Products ({products.length})</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">${product.price} / {product.unit}</p>
            <p className="quantity">Available: {product.quantity} {product.unit}</p>
            <p className="category">Category: {product.category}</p>
            
            {showFarmerInfo && product.farmer && (
              <p className="farmer">By: {product.farmer.name}</p>
            )}
            
            {product.location && (product.location.city || product.location.state) && (
              <p className="location">
                📍 {product.location.city} {product.location.city && product.location.state ? ',' : ''} {product.location.state}
              </p>
            )}
            
            {product.organic && <span className="organic-badge">🌱 Organic</span>}
            
            <div className="product-meta">
              <small>Added: {new Date(product.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;