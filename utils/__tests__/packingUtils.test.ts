import { Box, Product } from '../types';
import {
  calculateVolume,
  canFitInBox,
  groupProductsInABox,
  selectBox,
  getBoxes,
} from '../packingUtils';

// Mock the getBoxes function
jest.mock('../packingUtils', () => ({
  ...jest.requireActual('../packingUtils'),
  getBoxes: jest.fn(),
}));

const mockBoxes: Box[] = [
  { id: 1, name: 'Box1', width: 50, height: 40, length: 30, weight_limit: 20, volume: 60000 },
  { id: 2, name: 'Box2', width: 60, height: 50, length: 40, weight_limit: 25, volume: 120000 },
];

let box: Box;
let product1: Product;
let product2: Product;
let product3: Product;

beforeAll(() => {
  box = {
    id: 1,
    name: 'Box A',
    width: 50,
    height: 40,
    length: 30,
    weight_limit: 20,
    volume: 60000,
  };
  product1 = {
    id: 1,
    name: 'Product 1',
    weight: 5,
    width: 20,
    height: 10,
    length: 10,
    volume: 2000,
  };
  product2 = {
    id: 3,
    name: 'Product 2',
    weight: 7,
    width: 15,
    height: 10,
    length: 10,
    volume: 1500,
  };
  product3 = {
    id: 2,
    name: 'Product 3',
    weight: 25,
    width: 60,
    height: 50,
    length: 40,
    volume: 120000,
  };
});

describe('Utility Functions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();
  });

  test('mock getBoxes', () => {
    (getBoxes as jest.Mock).mockImplementation(() => mockBoxes);

    const boxes = getBoxes();
    expect(boxes).toEqual(mockBoxes);
  });

  test('calculateVolume', () => {
    expect(calculateVolume(2, 3, 4)).toBe(24);
    expect(calculateVolume(10, 10, 10)).toBe(1000);
  });

  test('canFitInBox', () => {
    expect(canFitInBox(product1, box)).toBe(true);
    expect(canFitInBox(product3, box)).toBe(false);
  });

  test('groupProductsInABox', () => {
    const productBoxMap = new Map<Product, Box>([
      [product1, box],
      [product2, box],
    ]);

    const groupedProducts = groupProductsInABox(productBoxMap);
    expect(groupedProducts.size).toBe(1);
    expect(groupedProducts.get(box)).toEqual([product1, product2]);
  });

  test('selectBox', () => {
    const { groupedAllocation, error } = selectBox([product1, product2, product3]);

    expect(groupedAllocation.size).toBe(2); // Since product3 is too large, it will not fit
    expect(error?.length).toBe(1); // One error for product3
    expect(error?.[0]).toContain(
      'Product Product 3 with dimensions 40x60x50 and weight 25kg does not fit in the largest available box.'
    );
  });
});
