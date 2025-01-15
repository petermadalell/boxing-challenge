import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProductSelection from '../ProductSelection';
import React from 'react';

// Mocking the products.json
jest.mock('../../utils/products.json', () => [
  { id: 1, name: 'Product A', weight: 1, width: 10, height: 10, length: 10, volume: 1000 },
  { id: 2, name: 'Product B', weight: 2, width: 20, height: 20, length: 20, volume: 8000 },
]);

describe('ProductSelection', () => {
  const handleSelectedProduct = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with autocomplete input', () => {
    render(
      <ProductSelection
        handleSelectedProduct={handleSelectedProduct}
        isProductAdded={false}
        isMaxQty={false}
        isProductDuplicate={false}
      />
    );

    expect(screen.getByLabelText('Select a Product')).toBeInTheDocument();
  });

  it('disables autocomplete when isMaxQty is true', () => {
    render(
      <ProductSelection
        handleSelectedProduct={handleSelectedProduct}
        isProductAdded={false}
        isMaxQty={true}
        isProductDuplicate={false}
      />
    );

    expect(screen.getByLabelText('Select a Product')).toBeDisabled();
  });

  it('calls handleSelectedProduct when a product is selected', () => {
    render(
      <ProductSelection
        handleSelectedProduct={handleSelectedProduct}
        isProductAdded={false}
        isMaxQty={false}
        isProductDuplicate={false}
      />
    );

    const input = screen.getByLabelText('Select a Product') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Product A' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(handleSelectedProduct).toHaveBeenCalledTimes(1);
  });

  it('clears selection when isProductAdded or isProductDuplicate changes to true', () => {
    const { rerender } = render(
      <ProductSelection
        handleSelectedProduct={handleSelectedProduct}
        isProductAdded={false}
        isMaxQty={false}
        isProductDuplicate={false}
      />
    );

    const input = screen.getByLabelText('Select a Product') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Product A' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(input.value).toBe('Product A');

    // Rerender with isProductAdded true
    rerender(
      <ProductSelection
        handleSelectedProduct={handleSelectedProduct}
        isProductAdded={true}
        isMaxQty={false}
        isProductDuplicate={false}
      />
    );
    expect(input.value).toBe('');

    // Rerender with isProductDuplicate true
    rerender(
      <ProductSelection
        handleSelectedProduct={handleSelectedProduct}
        isProductAdded={false}
        isMaxQty={false}
        isProductDuplicate={true}
      />
    );
    expect(input.value).toBe('');
  });
});
