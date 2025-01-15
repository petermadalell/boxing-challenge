import { useState } from 'react';

import Grid from '@mui/material/Grid2';

import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { Button, Box, Container, Typography, Stack, Paper } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AllInboxIcon from '@mui/icons-material/AllInbox';

import SelectedBoxes from '../components/SelectedBoxes';
import ProductSelection from '../components/ProductSelection';

import { selectBox, calculateVolume } from '../utils/packingUtils';
import { Product, Box as BoxType, AlertType } from '../utils/types';
import { errorMessages } from '../utils/errorMessages';
import ProductList from '@/components/ProductList';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
  minHeight: '270px',
}));

export default function App() {
  const [newProduct, setNewProduct] = useState<Product>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [alertMessage, setAlertMessage] = useState<AlertType[]>([]);
  const [isProductAdded, setIsProductAdded] = useState<boolean>(false);
  const [isProductDuplicate, setIsProductDuplicate] = useState<boolean>(false);
  const [selectedBoxes, setSelectedBoxes] = useState<Map<BoxType, Product[]>>(null);

  const isMaxQty = products.length >= 10;
  const isDisabledForm = !newProduct || isMaxQty || isProductDuplicate;

  const handleSelectedProduct = (product: Product) => {
    if (!product) return;

    setAlertMessage([]);
    const hasDuplicate = products.some(({ id }) => product.id === id);
    setIsProductDuplicate(hasDuplicate);
    if (hasDuplicate) {
      setAlertMessage((prev: AlertType[]) => {
        const newAlert: AlertType = {
          severity: 'warning',
          message: errorMessages.DUPLICATE_PRODUCT,
        };

        if (!prev) return [newAlert];

        prev = [...prev, newAlert];

        return prev;
      });

      setNewProduct(null);
      return;
    }

    const { length, width, height } = product;
    const addProductVolume: Product = {
      ...product,
      volume: calculateVolume(length, width, height),
    };

    setNewProduct(addProductVolume);
    setIsProductAdded(false);
    setIsProductDuplicate(false);
  };

  const handleAddNewProduct = () => {
    if (isMaxQty) {
      setAlertMessage((prev) => {
        const newAlert: AlertType = {
          severity: 'error',
          message: errorMessages.MAX_PRODUCTS,
        };

        prev = [...prev, newAlert];

        return prev;
      });
      return;
    }

    setProducts([...products, newProduct]);
    setIsProductAdded(true);
    setNewProduct(null);
    setAlertMessage(undefined);
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => {
      const curr = prev.filter((p) => p.id !== id);
      if (curr.length === 0) setSelectedBoxes(null);
      return curr;
    });
  };

  const handlePackBoxes = () => {
    const { groupedAllocation, error } = selectBox(products);
    setSelectedBoxes(groupedAllocation);
    setAlertMessage([]); //reset alert message

    if (error && error.length > 0) {
      setAlertMessage((prev) => {
        error.map((err) => {
          const newAlert: AlertType = {
            severity: 'warning',
            message: err,
          };
          if (!prev) prev = [newAlert];
          else prev = [...prev, newAlert];
        });

        return prev;
      });
    }
  };

  const handleOnClear = () => {
    setProducts([]);
    setSelectedBoxes(null);
    setAlertMessage(null);
  };

  return (
    <Container
      sx={{
        py: 5,
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={1}
        mb={2}
      >
        <AllInboxIcon color="info" />
        <Typography
          variant="h4"
          fontWeight={'bold'}
        >
          Boxing Challenge
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <Typography
              textAlign={'left'}
              variant="body1"
              gutterBottom
              fontWeight={'bold'}
              mb={2}
            >
              Add Products
            </Typography>
            <Box my={1}>
              <ProductSelection
                handleSelectedProduct={handleSelectedProduct}
                isProductAdded={isProductAdded}
                isMaxQty={isMaxQty}
                isProductDuplicate={isProductDuplicate}
              />
            </Box>
            <Box>
              <Button
                fullWidth
                variant="contained"
                size="medium"
                startIcon={<AddIcon />}
                onClick={handleAddNewProduct}
                disabled={isDisabledForm}
              >
                Add Product
              </Button>
            </Box>
            <Stack
              mt={5}
              alignItems={'flex-start'}
            >
              <Stack
                width={'100%'}
                flexDirection={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
                mb={1}
              >
                <Typography
                  variant="subtitle2"
                  color={isMaxQty ? 'error' : 'primary'}
                  fontWeight={'bold'}
                >
                  Added Products ({products.length}/10)
                </Typography>
                {products.length > 0 && (
                  <Button
                    startIcon={<ClearAllIcon />}
                    size="small"
                    color="error"
                    onClick={handleOnClear}
                    sx={{
                      fontWeight: 'bold',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Stack>
              {products.length > 0 && (
                <>
                  <Stack
                    gap={1}
                    width={'-webkit-fill-available'}
                    mb={2}
                  >
                    {products.map((product) => (
                      <ProductList
                        key={product.id}
                        product={product}
                        handleRemoveProduct={handleRemoveProduct}
                      />
                    ))}
                  </Stack>

                  <Button
                    startIcon={<InventoryIcon />}
                    onClick={handlePackBoxes}
                    fullWidth
                    variant="contained"
                    size="medium"
                    color="success"
                  >
                    Allocate into Boxes
                  </Button>
                </>
              )}
            </Stack>
            {alertMessage && alertMessage.length > 0 && (
              <Stack
                py={2}
                gap={1}
              >
                {alertMessage.map(({ message, severity }, index) => (
                  <Box
                    textAlign={'left'}
                    key={index}
                  >
                    <Alert severity={severity}>{message}</Alert>
                  </Box>
                ))}
              </Stack>
            )}
          </Item>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Item>
            <Typography
              textAlign={'left'}
              variant="body1"
              gutterBottom
              fontWeight={'bold'}
              mb={2}
            >
              Selected Boxes
            </Typography>
            <Stack
              alignItems={'flex-start'}
              gap={2}
              my={1}
              width={'100%'}
            >
              {selectedBoxes && selectedBoxes.size > 0 ? (
                <SelectedBoxes selectedBoxes={selectedBoxes} />
              ) : (
                <Typography
                  fontSize={'14px'}
                >{`No boxes packed yet. Add products and click "Allocate into Boxes" to start.`}</Typography>
              )}
            </Stack>
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}
