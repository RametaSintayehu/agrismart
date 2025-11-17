// Test API logic without actual server imports
const validateProduct = (productData) => {
  const errors = [];
  
  if (!productData.name?.trim()) {
    errors.push('Product name is required');
  }
  
  if (!productData.price || productData.price <= 0) {
    errors.push('Price must be greater than 0');
  }
  
  if (!productData.quantity || productData.quantity < 0) {
    errors.push('Quantity cannot be negative');
  }
  
  if (!['kg', 'lb', 'piece', 'bunch'].includes(productData.unit)) {
    errors.push('Valid unit is required');
  }
  
  return errors;
};

describe('Product Validation', () => {
  test('valid product data', () => {
    const productData = {
      name: 'Fresh Tomatoes',
      price: 2.5,
      quantity: 100,
      unit: 'kg',
      category: 'vegetables'
    };
    
    const errors = validateProduct(productData);
    expect(errors).toHaveLength(0);
  });
  
  test('invalid - missing name', () => {
    const productData = {
      name: '',
      price: 2.5,
      quantity: 100,
      unit: 'kg'
    };
    
    const errors = validateProduct(productData);
    expect(errors).toContain('Product name is required');
  });
  
  test('invalid - negative price', () => {
    const productData = {
      name: 'Fresh Tomatoes',
      price: -5,
      quantity: 100,
      unit: 'kg'
    };
    
    const errors = validateProduct(productData);
    expect(errors).toContain('Price must be greater than 0');
  });
  
  test('invalid - wrong unit', () => {
    const productData = {
      name: 'Fresh Tomatoes',
      price: 2.5,
      quantity: 100,
      unit: 'invalid-unit'
    };
    
    const errors = validateProduct(productData);
    expect(errors).toContain('Valid unit is required');
  });
});