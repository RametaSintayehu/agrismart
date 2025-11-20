import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders AgriSmart header', () => {
  render(<App />);
  const headerElement = screen.getByText(/AgriSmart/i);
  expect(headerElement).toBeInTheDocument();
});