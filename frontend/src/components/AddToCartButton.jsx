import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const AddToCartButton = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowPopup(true);
    setQuantity(1);
    
    // Hide popup after 2 seconds
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  return (
    <div className="add-to-cart-widget">
      <div className="quantity-selector">
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          max={product.quantity}
          value={quantity}
          onChange={handleQuantityChange}
          className="quantity-input"
        />
        <span className="unit">({product.unit})</span>
      </div>
      
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-btn"
        disabled={product.quantity === 0}
      >
        {product.quantity === 0 ? 'Out of Stock' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
      </button>

      {showPopup && (
        <div className="cart-popup">
          ✅ Added to cart!
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;