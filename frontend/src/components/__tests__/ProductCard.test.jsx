import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';

const mockProducto = {
  id: 1,
  nombre: 'Gorra Nike',
  precio: 150000,
  marca: 'Nike',
  stock: 10,
  categoria: { nombre: 'Gorras' },
  imagenes: [{ id: 1, url: 'https://example.com/img.jpg', es_principal: true }],
};

describe('ProductCard', () => {
  it('renders product details', () => {
    render(
      <ProductCard
        producto={mockProducto}
        esAdmin={false}
        agregadoId={null}
        agregando={false}
        onVer={vi.fn()}
        onAgregarAlCarrito={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
      />
    );
    expect(screen.getByText('Gorra Nike')).toBeInTheDocument();
    expect(screen.getByText('Nike')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
  });

  it('shows Agotado when stock is 0', () => {
    render(
      <ProductCard
        producto={{ ...mockProducto, stock: 0 }}
        esAdmin={false}
        agregadoId={null}
        agregando={false}
        onVer={vi.fn()}
        onAgregarAlCarrito={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
      />
    );
    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });

  it('shows admin buttons when esAdmin is true', () => {
    render(
      <ProductCard
        producto={mockProducto}
        esAdmin={true}
        agregadoId={null}
        agregando={false}
        onVer={vi.fn()}
        onAgregarAlCarrito={vi.fn()}
        onEditar={vi.fn()}
        onEliminar={vi.fn()}
      />
    );
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });
});
