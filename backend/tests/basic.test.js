// Simple test that will definitely work
test('1 + 1 should equal 2', () => {
  expect(1 + 1).toBe(2);
});

test('should handle strings', () => {
  expect('hello').toBe('hello');
});

test('should handle arrays', () => {
  const arr = [1, 2, 3];
  expect(arr).toHaveLength(3);
  expect(arr).toContain(2);
});