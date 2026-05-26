import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Toast from '../Toast';

describe('Toast', () => {
  it('renders nothing when mensaje is null', () => {
    const { container } = render(<Toast mensaje={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders success toast', () => {
    render(<Toast mensaje={{ tipo: 'ok', texto: 'Operación exitosa' }} />);
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
  });

  it('renders error toast', () => {
    render(<Toast mensaje={{ tipo: 'error', texto: 'Algo salió mal' }} />);
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });
});
