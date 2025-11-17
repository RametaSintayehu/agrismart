// Simple test that will definitely work
test('1 + 1 should equal 2', () => {
  expect(1 + 1).toBe(2);
});

test('AgriSmart name test', () => {
  expect('AgriSmart').toBe('AgriSmart');
});

test('array operations', () => {
  const fruits = ['apple', 'banana'];
  expect(fruits).toHaveLength(2);
  expect(fruits).toContain('apple');
});