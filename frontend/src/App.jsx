import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './contexts/CartContext'; // Fixed import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedMarketplace from './components/EnhancedMarketplace';
import Login from './components/Login';
import Register from './components/Register';
import FarmerDashboard from './components/FarmerDashboard';
import CartSidebar from './components/CartSidebar';
import UserDashboard from './components/UserDashboard';
import Notifications from './components/Notifications';
import Checkout from './components/Checkout';
import { productAPI } from './services/api';
import './App.css';

function App() { // Changed from () to {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // Fixed spacing

  // Use cart context
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuth('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <div className="header-content">
              <div className="logo-section">
                <h1>🌱 AgriSmart</h1>
                <p>Farmer Marketplace & Pricing</p>
              </div>
              
              <div className="user-section">
                {user ? (
                  <div className="user-info">
                    {/* Notification Bell */}
                    <button
                      onClick={() => setShowNotifications(true)} // Fixed onClick
                      className="notification-bell"
                    >
                      🔔 {notificationCount > 0 && (
                        <span className="notification-count">{notificationCount}</span>
                      )}
                    </button>

                    {/* Cart Icon for buyers */}
                    {user.role === 'buyer' && (
                      <button 
                        onClick={() => setShowCart(true)} 
                        className="cart-icon-btn"
                      >
                        🛒 Cart ({cartItemsCount}) {/* Fixed variable name and syntax */}
                      </button>
                    )}
                    <span>Welcome, {user.name} ({user.role})</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                ) : (
                  <div className="auth-buttons">
                    <button onClick={() => setShowAuth('login')}>Login</button>
                    <button onClick={() => setShowAuth('register')}>Register</button>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          <main className="app-main">
            {/* Auth Modals */}
            {showAuth === 'login' && (
              <div className="modal-overlay">
                <div className="modal">
                  <Login onLogin={handleLogin} />
                  <button onClick={() => setShowAuth('')} className="close-btn">Close</button>
                </div>
              </div>
            )}
            
            {showAuth === 'register' && (
              <div className="modal-overlay">
                <div className="modal">
                  <Register onRegister={handleLogin} />
                  <button onClick={() => setShowAuth('')} className="close-btn">Close</button>
                </div>
              </div>
            )}

            {/* Cart Sidebar */}
            <CartSidebar 
              isOpen={showCart}
              onClose={() => setShowCart(false)}
              onCheckout={handleCheckout}
            />

            {/* Notifications Panel */}
            <Notifications 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />

            {/* Checkout Modal */}
            {showCheckout && (
              <Checkout
                onClose={() => setShowCheckout(false)} // Fixed prop name
                onOrderSuccess={() => {
                  setShowCheckout(false);
                  fetchProducts(); 
                }}
              />
            )}

            <Routes>
              <Route path="/" element={
                <div className="home">
                  {user ? (
                    <div className="user-home">
                      {/* Show dashboard for both farmers and buyers */}
                      <UserDashboard user={user}/>
                    </div>
                  ) : (
                    <EnhancedMarketplace products={products} loading={loading} user={user}/>
                  )}
                </div>
              }/>

              {/* Add a separate marketplace route */}
              <Route path='/marketplace' element={
                <EnhancedMarketplace products={products} loading={loading} user={user} />
              }/>
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;