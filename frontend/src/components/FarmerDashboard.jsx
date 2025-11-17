import React, { useState, useEffect } from 'react';
import CreateProduct from './CreateProduct';
import ProductList from './productList';
import { productAPI } from '../services/api';

const FarmerDashboard = ({ user }) => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'myProducts'

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getMyProducts();
      setMyProducts(response.data);
    } catch (error) {
      console.error('Error fetching my products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'myProducts') {
      fetchMyProducts();
    }
  }, [activeTab]);

  const handleProductCreated = (newProduct) => {
    setActiveTab('myProducts');
    fetchMyProducts(); // Refresh the product list
  };

  return (
    <div className="farmer-dashboard">
      <h2>Farmer Dashboard</h2>
      <p>Manage your farm products and listings</p>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          Add New Product
        </button>
        <button 
          className={`tab-button ${activeTab === 'myProducts' ? 'active' : ''}`}
          onClick={() => setActiveTab('myProducts')}
        >
          My Products ({myProducts.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'add' && (
          <CreateProduct onProductCreated={handleProductCreated} />
        )}
        
        {activeTab === 'myProducts' && (
          <div className="my-products">
            <h3>My Listed Products</h3>
            {loading ? (
              <p>Loading your products...</p>
            ) : myProducts.length === 0 ? (
              <div className="empty-state">
                <p>You haven't listed any products yet.</p>
                <button 
                  onClick={() => setActiveTab('add')}
                  className="primary-btn"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <ProductList products={myProducts} showFarmerInfo={false} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;