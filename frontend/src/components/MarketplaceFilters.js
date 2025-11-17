import React from 'react';

const MarketplaceFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange,
  onClearFilters 
}) => {
  return (
    <div className="marketplace-filters">
      <div className="filters-header">
        <h3>Find Products</h3>
        <button onClick={onClearFilters} className="clear-filters-btn">
          Clear Filters
        </button>
      </div>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      {/* Filters Grid */}
      <div className="filters-grid">
        {/* Category Filter */}
        <div className="filter-group">
          <label>Category</label>
          <select 
            value={filters.category} 
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="livestock">Livestock</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
          <label>Max Price</label>
          <select 
            value={filters.maxPrice} 
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          >
            <option value="">Any Price</option>
            <option value="5">Under $5</option>
            <option value="10">Under $10</option>
            <option value="20">Under $20</option>
            <option value="50">Under $50</option>
          </select>
        </div>

        {/* Organic Filter */}
        <div className="filter-group">
          <label>Organic</label>
          <select 
            value={filters.organic} 
            onChange={(e) => onFilterChange('organic', e.target.value)}
          >
            <option value="">All Products</option>
            <option value="true">Organic Only</option>
            <option value="false">Non-Organic Only</option>
          </select>
        </div>

        {/* Sort Options */}
        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={filters.sortBy} 
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Quick Category Filters */}
      <div className="quick-filters">
        <label>Quick Categories:</label>
        <div className="category-chips">
          {['vegetables', 'fruits', 'grains', 'dairy'].map(category => (
            <button
              key={category}
              className={`category-chip ${filters.category === category ? 'active' : ''}`}
              onClick={() => onFilterChange('category', filters.category === category ? '' : category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;