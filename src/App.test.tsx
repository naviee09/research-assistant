import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Smart Research Assistant', () => {
  render(<App />);
  const linkElement = screen.getByText(/Smart Research Assistant/i);
  expect(linkElement).toBeInTheDocument();
});
