// Test pricing and calculation logic
const calculateTotalPrice = (price, quantity, unit) => {
  if (price <= 0 || quantity < 0) return 0;
  return price * quantity;
};

const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

describe('Pricing Calculations', () => {
  test('calculate total price correctly', () => {
    const total = calculateTotalPrice(2.5, 10, 'kg');
    expect(total).toBe(25);
  });
  
  test('return 0 for invalid price', () => {
    const total = calculateTotalPrice(-5, 10, 'kg');
    expect(total).toBe(0);
  });
  
  test('format price correctly', () => {
    const formatted = formatPrice(25.5);
    expect(formatted).toBe('$25.50');
  });
});