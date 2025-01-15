import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Product } from '../utils/types';
import productData from '../utils/products.json';
import { Stack, Container } from '@mui/material';

type ProductSelectionProps = {
  handleSelectedProduct: (product: Product) => void;
  isProductAdded: boolean;
  isMaxQty: boolean;
  isProductDuplicate: boolean;
};

export default function ProductSelection({
  handleSelectedProduct,
  isProductAdded,
  isMaxQty,
  isProductDuplicate,
}: ProductSelectionProps) {
  const sortedProducts = productData.sort((a, b) => a.name.localeCompare(b.name));
  const [value, setValue] = useState<Product | null>(null);

  useEffect(() => {
    if (isProductAdded || isProductDuplicate) setValue(null);
  }, [isProductAdded, isProductDuplicate]);

  return (
    <Container disableGutters>
      <Stack gap={2}>
        <Autocomplete
          style={{
            width: '100%',
          }}
          disabled={isMaxQty}
          fullWidth
          value={value}
          onChange={(_event, newValue: Product) => {
            setValue(newValue);
            handleSelectedProduct(newValue);
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={sortedProducts}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.name) {
              return option.name;
            }
            // Regular option
            return option.name;
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <li
                key={key}
                {...optionProps}
              >
                {option.name}
              </li>
            );
          }}
          sx={{ width: 300 }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a Product"
            />
          )}
        />
      </Stack>
    </Container>
  );
}
