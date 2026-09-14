import { render, screen } from '@testing-library/react';
import Loading from './Loading.jsx';

describe('Loading', () => {
  it('renders the loading state', () => {
    render(<Loading />);

    expect(screen.getByText('Loading....')).toBeInTheDocument();
  });
});
