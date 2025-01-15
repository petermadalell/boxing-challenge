import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Product, Box as BoxType } from '../../utils/types';
import SelectedBoxes from '../SelectedBoxes';

// Mock the ProductList component
jest.mock('../ProductList', () => {
  return function DummyProductList(props: { product: Product }) {
    return <div data-testid="product-list">{props.product.name}</div>;
  };
});

describe('SelectedBoxes', () => {
  const box: BoxType = {
    id: 1,
    name: 'Box1',
    width: 50,
    height: 40,
    length: 30,
    weight_limit: 20,
    volume: 60000,
  };

  const products: Product[] = [
    { id: 1, name: 'Product 1', weight: 5, width: 10, height: 5, length: 5, volume: 250 },
    { id: 2, name: 'Product 2', weight: 7, width: 12, height: 6, length: 6, volume: 432 },
  ];

  const selectedBoxes = new Map<BoxType, Product[]>([[box, products]]);

  it('renders the box details correctly', () => {
    render(<SelectedBoxes selectedBoxes={selectedBoxes} />);

    expect(screen.getByText(/Box1 \(50x40x30\)/)).toBeInTheDocument();
    expect(screen.getByText(/weight remaining: 20.00kg/)).toBeInTheDocument();
    expect(screen.getByText(/Space left 60,000 cm/)).toBeInTheDocument();
  });

  it('renders the products inside the box', () => {
    render(<SelectedBoxes selectedBoxes={selectedBoxes} />);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getAllByTestId('product-list')).toHaveLength(products.length);
    });
  });
});
