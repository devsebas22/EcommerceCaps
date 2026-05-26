import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmModal from '../ConfirmModal';

describe('ConfirmModal', () => {
  it('renders modal with title and message', () => {
    render(
      <ConfirmModal
        show={true}
        titulo="Eliminar producto"
        mensaje="¿Estás seguro de eliminar este producto?"
        onConfirmar={() => {}}
        onCancelar={() => {}}
      />
    );
    expect(screen.getByText('Eliminar producto')).toBeInTheDocument();
    expect(screen.getByText('¿Estás seguro de eliminar este producto?')).toBeInTheDocument();
  });

  it('calls onConfirmar when confirm button is clicked', () => {
    const onConfirmar = vi.fn();
    render(
      <ConfirmModal
        show={true}
        titulo="Confirmar"
        mensaje="¿Confirmar?"
        onConfirmar={onConfirmar}
        onCancelar={() => {}}
        labelConfirmar="Sí, eliminar"
      />
    );
    fireEvent.click(screen.getByText('Sí, eliminar'));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
  });

  it('calls onCancelar when cancel button is clicked', () => {
    const onCancelar = vi.fn();
    render(
      <ConfirmModal
        show={true}
        titulo="Confirmar"
        mensaje="¿Confirmar?"
        onConfirmar={() => {}}
        onCancelar={onCancelar}
      />
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

  it('uses default label when labelConfirmar is not provided', () => {
    render(
      <ConfirmModal
        show={true}
        titulo="Confirmar"
        mensaje="¿Confirmar?"
        onConfirmar={() => {}}
        onCancelar={() => {}}
      />
    );
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });
});
