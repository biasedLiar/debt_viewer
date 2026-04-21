import { render, screen } from '@testing-library/react';
import App from './App';

test('renders debt viewer header', () => {
  render(<App />);
  expect(screen.getByText(/Debt Viewer/i)).toBeInTheDocument();
});
 