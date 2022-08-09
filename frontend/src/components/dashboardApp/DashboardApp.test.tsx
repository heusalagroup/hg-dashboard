import { render, screen } from '@testing-library/react';
import { DashboardApp } from './DashboardApp';

test('renders learn react link', () => {
  render(<DashboardApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
