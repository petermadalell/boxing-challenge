import { Product, Box as BoxType } from '../utils/types';
import { Stack, Typography } from '@mui/material';
import ProductList from './ProductList';

type SelectedBoxesProps = {
  selectedBoxes: Map<BoxType, Product[]>;
};

export default function SelectedBoxes({ selectedBoxes }: SelectedBoxesProps) {
  return Array.from(selectedBoxes.entries()).map(([box, products]) => (
    <Stack
      width={'100%'}
      alignItems={'flex-start'}
      border={'1px solid #c2cbcf'}
      borderRadius={'8px'}
      gap={1}
      p={2}
      key={box.id}
    >
      <Stack
        width={'inherit'}
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Typography
          variant="subtitle2"
          fontWeight={'bold'}
        >
          {box.name} ({box.width}x{box.height}x{box.length}){' '}
          <Typography
            variant="caption"
            fontStyle={'italic'}
          >
            weight remaining: {box.weight_limit.toFixed(2)}kg
          </Typography>
        </Typography>

        <Typography
          variant="caption"
          color="#6b7280"
        >
          {`Space left ${box.volume.toLocaleString()} cm`}
          <sup>3</sup>
        </Typography>
      </Stack>
      {Array.from(products.entries()).map(([index, product]) => (
        <ProductList
          product={product}
          hasRemoveIcon={false}
          key={index}
        />
      ))}
    </Stack>
  ));
}
