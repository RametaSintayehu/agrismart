import { test } from 'node:test';
import assert from 'node:assert';

// Test utility functions for AgriSmart
const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

const validateProduct = (product) => {
  if (!product.name || product.name.trim() === '') {
    return 'Product name is required';
  }
  if (!product.price || product.price <= 0) {
    return 'Price must be greater than 0';
  }
  return null;
};

test('basic math operations', (t) => {
  assert.strictEqual(1 + 1, 2);
});

test('price formatting', (t) => {
  assert.strictEqual(formatPrice(25.5), '$25.50');
  assert.strictEqual(formatPrice(10), '$10.00');
});

test('product validation', (t) => {
  const validProduct = { name: 'Tomatoes', price: 2.5 };
  const invalidProduct1 = { name: '', price: 2.5 };
  const invalidProduct2 = { name: 'Tomatoes', price: -1 };
  
  assert.strictEqual(validateProduct(validProduct), null);
  assert.strictEqual(validateProduct(invalidProduct1), 'Product name is required');
  assert.strictEqual(validateProduct(invalidProduct2), 'Price must be greater than 0');
});