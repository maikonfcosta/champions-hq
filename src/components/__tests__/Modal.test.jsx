import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';
import React from 'react';

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={vi.fn()}>Test Content</Modal>);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should render content and title when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={vi.fn()} title="Test Title">Test Content</Modal>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<Modal isOpen={true} onClose={handleClose}>Test Content</Modal>);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
