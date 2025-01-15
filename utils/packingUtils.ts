import { Box, Product } from './types';
import boxesJson from '../utils/boxes.json';

//return box with volume
export const getBoxes = (): Box[] => {
  let boxList = boxesJson as Box[];
  boxList = boxList.map((box) => {
    {
      return { ...box, volume: calculateVolume(box.length, box.width, box.height) };
    }
  });
  return boxList;
};

//calculate volume
export const calculateVolume = (length: number, width: number, height: number): number => {
  return length * width * height;
};

export function canFitInBox(product: Product, box: Box): boolean {
  return (
    //check product volume, dimension and weight limit against the box
    //The total volume of the selected box(es) must be greater than the total volume of the products placed in it.
    //No single dimension of any product can be greater than any dimension of its assigned box (e.g., product width ≤ box width).
    //The total weight of the products in any box must not exceed the box’s weight limit.
    box.volume! >= product.volume &&
    box.width >= product.width &&
    box.height >= product.height &&
    box.length >= product.length &&
    box.weight_limit >= product.weight
  );
}

//return list of grouped products in the box
export function groupProductsInABox(map: Map<Product, Box>): Map<Box, Product[]> {
  const groupedMap = new Map<Box, Product[]>();

  for (const [key, value] of map.entries()) {
    if (!groupedMap.has(value)) {
      //if box not yet added
      groupedMap.set(value, []); //add the box
    }
    groupedMap.get(value)!.push(key); //push products into the box
  }

  return groupedMap; //return grouped products
}

export function selectBox(products: Product[]): {
  groupedAllocation: Map<Box, Product[]>;
  error?: string[];
} {
  const boxes = getBoxes();
  // sort products by volume, ascending
  products.sort((a, b) => a.volume - b.volume);
  // sort boxes by volume, ascending
  boxes.sort((a, b) => a.volume! - b.volume!);

  const allocation = new Map<Product, Box>();
  let groupedAllocation = new Map<Box, Product[]>();
  const errorMessages: string[] = [];

  for (const product of products) {
    let allocated = false;

    for (const box of boxes) {
      if (canFitInBox(product, box)) {
        allocation.set(product, box);
        box.volume! -= product.volume; // update box volume after placing the product
        box.weight_limit -= product.weight; // update box weight limit
        allocated = true;
        break;
      }
    }

    if (!allocated) {
      //If a product cannot fit in any box, allocate the product to its own box.
      const largestBox = boxes[4]; //select largest box from sort

      if (canFitInBox(product, largestBox)) {
        allocation.set(product, largestBox);
        largestBox.volume! -= product.volume; // update largest box volume
        largestBox.weight_limit -= product.weight; // update largest box weight limit
      } else {
        //Return grouped products and an error message if the product does not fit in the largest available box.
        groupedAllocation = groupProductsInABox(allocation);
        errorMessages.push(
          `Product ${product.name} with dimensions ${product.length}x${product.width}x${product.height} and weight ${product.weight}kg does not fit in the largest available box.`
        );
      }
    }
  }

  groupedAllocation = groupProductsInABox(allocation);

  return { groupedAllocation, error: errorMessages };
}
