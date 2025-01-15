import { Product } from '../utils/types';
import { Typography, IconButton } from '@mui/material';
import Stack, { StackProps } from '@mui/material/Stack';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';

type ProductListProps = StackProps & {
  product: Product;
  handleRemoveProduct?: (id: number) => void;
  hasRemoveIcon?: boolean;
};

export default function ProductList({
  product,
  handleRemoveProduct,
  hasRemoveIcon = true,
  ...stackProps
}: ProductListProps) {
  return (
    <Stack
      {...stackProps}
      width={'100%'}
      flexDirection={'row'}
      bgcolor={'#ebf1f6'}
      justifyContent={'space-between'}
      alignItems={'center'}
      px={1}
      py={'4px'}
      borderRadius={1}
    >
      <Typography
        variant="body1"
        fontSize={'14px'}
      >
        {product.name} ({product.width}x{product.height}x{product.length}){' '}
        <small>{product.weight}kg</small>
      </Typography>
      {hasRemoveIcon && handleRemoveProduct && (
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => handleRemoveProduct(product.id)}
          color="error"
        >
          <ClearIcon fontSize="inherit" />
        </IconButton>
      )}
    </Stack>
  );
}
