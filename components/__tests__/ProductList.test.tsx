import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Product } from '../../utils/types';
import ProductList from '../ProductList';
import React from 'react';

describe('ProductList', () => {
  const product: Product = {
    id: 1,
    name: 'Test Product',
    weight: 5,
    width: 10,
    height: 5,
    length: 5,
    volume: 250,
  };

  it('renders product details correctly', () => {
    render(<ProductList product={product} />);

    expect(screen.getByText('Test Product (10x5x5)')).toBeInTheDocument();
    expect(screen.getByText(/5kg/i)).toBeInTheDocument();
  });

  it('renders the remove icon when hasRemoveIcon is true', () => {
    const handleRemoveProduct = jest.fn();
    render(
      <ProductList
        product={product}
        handleRemoveProduct={handleRemoveProduct}
        hasRemoveIcon={true}
      />
    );

    const removeButton = screen.getByRole('button', { name: /delete/i });
    expect(removeButton).toBeInTheDocument();
  });

  it('does not render the remove icon when hasRemoveIcon is false', () => {
    render(
      <ProductList
        product={product}
        hasRemoveIcon={false}
      />
    );

    const removeButton = screen.queryByRole('button', { name: /delete/i });
    expect(removeButton).toBeNull();
  });

  it('calls handleRemoveProduct when remove icon is clicked', () => {
    const handleRemoveProduct = jest.fn();
    render(
      <ProductList
        product={product}
        handleRemoveProduct={handleRemoveProduct}
        hasRemoveIcon={true}
      />
    );

    const removeButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(removeButton);

    expect(handleRemoveProduct).toHaveBeenCalledTimes(1);
    expect(handleRemoveProduct).toHaveBeenCalledWith(product.id);
  });
});
