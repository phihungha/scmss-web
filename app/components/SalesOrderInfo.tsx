'use client';
import React, { useState } from 'react';
import {
  Box,
  Text,
  Grid,
  Stack,
  Heading,
  Input,
  GridItem,
  FormControl,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { ICustomer, ISaleResponse } from '../types/sales';
import { getAllCustomers } from '../api/customerApi';
import { getAllFacilities } from '../api/facilityApi';
import { IFacilityResponse } from '../types/productionFacility';
import { dateToFullFormat } from '../utils/time-conversion';

interface OrderProps {
  toLocation: string;
  currentOrder: ISaleResponse;
  setSelectedCustomerId: (id: number) => void;
  setSelectedFacilityId: (id: number) => void;
  setToLocation: (location: string) => void;
}

export default function SalesOrderInfo(salesOrder: OrderProps) {
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getAllCustomers(),
  });

  const { data: facilities } = useQuery({
    queryKey: ['facilities'],
    queryFn: () => getAllFacilities(),
  });
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState(0);
  const createTime = dateToFullFormat(
    new Date(salesOrder.currentOrder.createTime),
  );
  const endTime = dateToFullFormat(new Date(salesOrder.currentOrder.endTime));
  const executionFinishTime = dateToFullFormat(
    new Date(salesOrder.currentOrder.executionFinishTime),
  );
  function HandleCustomer(customerId: number) {
    setSelectedCustomer(customerId);
    salesOrder.setSelectedCustomerId(customerId);
  }
  function HandleFacility(facilityId: number) {
    setSelectedFacility(facilityId);
    salesOrder.setSelectedFacilityId(facilityId);
  }

  if (customers === undefined) {
    return <>Still loading...</>;
  }
  if (facilities === undefined) {
    return <>Still loading...</>;
  }
  var endUser = '';
  if (salesOrder.currentOrder.endUser != null) {
    endUser = salesOrder.currentOrder.endUser.name;
  }

  return (
    <Stack>
      <Box as={'header'}>
        <Heading lineHeight={1.1} fontWeight={600} fontSize={'5xl'}>
          #1
        </Heading>
      </Box>
      <Box>
        <Text
          fontSize={'3xl'}
          color={'black.500'}
          fontWeight={'bold'}
          textTransform={'uppercase'}
          mb={'4'}
          pt={10}
        >
          Order Details
        </Text>
        <Grid
          templateRows="repeat(10, 1fr)"
          templateColumns="repeat(3, 1fr)"
          gap={5}
        >
          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Facility:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Box w="full">
              <FormControl w="auto">
                <AutoComplete
                  openOnFocus
                  value={selectedFacility}
                  onChange={(facilityId: number) => HandleFacility(facilityId)}
                >
                  <AutoCompleteInput
                    placeholder={
                      salesOrder.currentOrder.productionFacility.name
                    }
                    variant="filled"
                  />
                  <AutoCompleteList>
                    {facilities?.map((facility: IFacilityResponse) => (
                      <AutoCompleteItem
                        key={facility.id}
                        label={facility.name}
                        value={facility.id}
                        textTransform="capitalize"
                      >
                        {facility.name}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
              </FormControl>
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Customer:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Box w="full">
              <FormControl w="auto">
                <AutoComplete
                  openOnFocus
                  value={selectedCustomer}
                  onChange={(customerId: number) => HandleCustomer(customerId)}
                >
                  <AutoCompleteInput
                    placeholder={salesOrder.currentOrder.customer.contactPerson}
                    variant="filled"
                  />
                  <AutoCompleteList>
                    {customers?.map((customer: ICustomer) => (
                      <AutoCompleteItem
                        key={customer.id}
                        label={customer.contactPerson}
                        value={customer.id}
                        textTransform="capitalize"
                      >
                        {customer.contactPerson}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
              </FormControl>
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Location:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Box w="full">
              <Input
                value={salesOrder.toLocation}
                onChange={(location: string) =>
                  salesOrder.setToLocation(location)
                }
              />
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Create User:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>
              {salesOrder.currentOrder.createUser.name}
            </Text>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              End user:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>{endUser}</Text>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Status:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>{salesOrder.currentOrder.status}</Text>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Payment Status:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>{salesOrder.currentOrder.paymentStatus}</Text>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Create time:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>{createTime}</Text>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              End time:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>{endTime}</Text>
          </GridItem>

          <GridItem colSpan={1}>
            <Text fontSize={'xl'} as={'span'} fontWeight={'bold'}>
              Execution Finish time:
            </Text>
          </GridItem>
          <GridItem colSpan={2}>
            <Text fontSize={'xl'}>{executionFinishTime}</Text>
          </GridItem>
        </Grid>
      </Box>
    </Stack>
  );
}
