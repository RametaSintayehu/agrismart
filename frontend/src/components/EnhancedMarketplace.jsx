import React, { useState, useMemo } from 'react';
import ProductList from './ProductList';
import MarketplaceFilters from './MarketplaceFilters';

const EnhancedMarketplace = ({ products, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    maxPrice: '',
    organic: '',
    sortBy: 'newest'
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }

    // Price filter
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      result = result.filter(product => product.price <= maxPrice);
    }

    // Organic filter
    if (filters.organic !== '') {
      const organicFilter = filters.organic === 'true';
      result = result.filter(product => product.organic === organicFilter);
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [products, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      maxPrice: '',
      organic: '',
      sortBy: 'newest'
    });
  };

  const activeFilterCount = Object.values(filters).filter(val => val !== '').length + (searchTerm ? 1 : 0);

  return (
    <div className="enhanced-marketplace">
      <div className="marketplace-header">
        <h2>🌱 Marketplace</h2>
        <p>Discover fresh farm products directly from local farmers</p>
        
        <div className="marketplace-stats">
          <span className="products-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
          </span>
          {activeFilterCount > 0 && (
            <span className="active-filters">
              ({activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      </div>

      <div className="marketplace-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <MarketplaceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Products Grid */}
        <main className="products-main">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading fresh products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌾</div>
              <h3>No products found</h3>
              <p>
                {searchTerm || activeFilterCount > 0 
                  ? "Try adjusting your search or filters to see more products."
                  : "No products available in the marketplace yet. Check back soon!"
                }
              </p>
              {(searchTerm || activeFilterCount > 0) && (
                <button onClick={handleClearFilters} className="primary-btn">
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <ProductList products={filteredProducts} user={user} />
          )}
        </main>
      </div>
    </div>
  );
};

export default EnhancedMarketplace;