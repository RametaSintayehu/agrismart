import React from 'react';
import { useCart } from '../contexts/CartContext';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-sidebar-overlay">
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>🛒 Your Cart ({getCartItemsCount()})</h3>
          <button onClick={onClose} className="close-cart-btn">×</button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <span>Add some fresh products!</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.product._id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.product.name}</h4>
                      <p className="item-price">${item.price} / {item.product.unit}</p>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.quantity}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ${getCartTotal().toFixed(2)}</strong>
                </div>
                
                <div className="cart-actions">
                  <button onClick={clearCart} className="clear-cart-btn">
                    Clear Cart
                  </button>
                  <button onClick={onCheckout} className="checkout-btn">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;