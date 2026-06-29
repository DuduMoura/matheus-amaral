import { render, screen } from '@testing-library/react';
import Totem from './Totem';

test('renders totem header', () => {
  render(<Totem />);
  const header = screen.getByText(/o que deseja pedir hoje\?/i);
  expect(header).toBeInTheDocument();
});

