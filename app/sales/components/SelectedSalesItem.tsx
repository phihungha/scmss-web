'use client';
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsXLg } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { getProduct } from '../../api/productApi';
import { PriceInput } from '../../types/sales';

interface OrderProps {
  price: PriceInput;
  handleDelete: (id: number) => void;
  handleRefresh: () => void;
}

export default function SelectedSalesItem(item: OrderProps) {
  const [quantity, setQuantity] = useState<number>(item.price.quantity);
  const { data: product } = useQuery({
    queryKey: [`product${item.price.itemId}`],
    queryFn: () => getProduct(`${item.price.itemId}`),
  });
  if (product === undefined) {
    return <>Still loading...</>;
  }
  item.price.price = product.price;
  if (item.price.price == 0) {
    item.handleRefresh();
  }
  function handleChange(quantity: number) {
    item.price.quantity = quantity;
    item.price.price = product.price;
    setQuantity(quantity);
    item.handleRefresh();
  }
  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow="hidden"
      variant="outline"
    >
      <Image
        objectFit="cover"
        maxW={{ base: '100%', sm: '200px' }}
        src={product.imageUrl}
        alt={product.name}
      />

      <Stack width="full">
        <CardBody>
          <Heading size="lg">{product.name}</Heading>
          <Stack>
            <Stack pt={5} alignItems="center" direction={'row'}>
              <Text fontSize={'xl'}>Quantity:</Text>
              <Box>
                <NumberInput
                  value={quantity}
                  onChange={(quantity: number) => handleChange(quantity)}
                  min={1}
                  max={1000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            </Stack>
            <Stack alignItems="center" direction={'row'}>
              <Text fontSize={'xl'}>Unit:</Text>
              <Text fontSize={'xl'}>{product.unit}</Text>
            </Stack>
            <Stack alignItems="center" direction={'row'}>
              <Text fontSize={'xl'}>Price:</Text>
              <Text fontSize={'xl'}>{product.price}</Text>
            </Stack>
          </Stack>
        </CardBody>
      </Stack>
      <div className="self-center p-5">
        <Button
          onClick={() => item.handleDelete(item.price.itemId)}
          variant="solid"
          colorScheme="white"
        >
          <BsXLg color="black" />
        </Button>
      </div>
    </Card>
  );
}
