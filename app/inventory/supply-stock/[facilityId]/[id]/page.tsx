'use client';
import { getWarehouseSupplyItem } from '@/app/api/inventory';
import { FormLabelText } from '@/app/components/texts';
import { WarehouseSupplyItemEvent } from '@/app/models/inventory';
import { dateToFullFormat } from '@/app/utils/time-formats';

import { LoadingPage } from '@/app/components/spinners';
import {
  Button,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Chart } from 'react-google-charts';
import { useQuery } from 'react-query';
export default function SupplyStockDetailPage({
  params,
}: {
  params: { id: number; facilityId: number };
}) {
  const [warehouseSupplyItemEvents, setWarehouseSupplyItemEvents] = useState<
    WarehouseSupplyItemEvent[]
  >([]);
  const facilityId = params.facilityId;
  const productId = params.id;
  const { data: items } = useQuery({
    queryKey: ['WarehouseProductItem' + `/${facilityId}/${productId}`],
    queryFn: () => getWarehouseSupplyItem(facilityId, productId),
    onSuccess: (resp) => {
      if (resp.events) {
        setWarehouseSupplyItemEvents(resp.events);
      }
    },
  });

  function convertChartData(
    x_title: string,
    y_title: string,
    data: WarehouseSupplyItemEvent[],
  ) {
    const mapped = data.map((d) => [d.time.toLocaleString(), d.quantity]);
    return [[`${x_title}`, `${y_title}`], ...mapped];
  }
  if (items === undefined) {
    return <LoadingPage />;
  }
  return (
    <>
      <Stack gap={20}>
        <WarehouseProductEventTable items={warehouseSupplyItemEvents} />
        <Chart
          chartType="LineChart"
          data={convertChartData('Time', 'Quantity', warehouseSupplyItemEvents)}
          width="100%"
          height="400px"
          legendToggle
        />
        <FormLabelText pb={20}>Quantity by time</FormLabelText>
      </Stack>
    </>
  );
}

function WarehouseProductEventTable({
  items: items,
}: {
  items?: WarehouseSupplyItemEvent[];
}) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Time</Th>
            <Th>Change</Th>
            <Th>Quantity</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item) => (
            <WarehouseProductEventTableItem
              key={new Date(item.time).toLocaleTimeString()}
              item={item}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function WarehouseProductEventTableItem({
  item,
}: {
  item: WarehouseSupplyItemEvent;
}) {
  return (
    <Tr>
      <Td>{dateToFullFormat(new Date(item.time))}</Td>
      <Td color={item.change < 0 ? 'red' : 'green'}>
        {item.change.toFixed(2)}
      </Td>
      <Td>{item.quantity.toFixed(2)}</Td>
      <Td>
        {(() => {
          if (item.purchaseOrderId !== null) {
            return (
              <Link href={`/purchases/orders/${item.purchaseOrderId}`}>
                <Button variant="solid" colorScheme="blue">
                  Purchase Order #{item.purchaseOrderId}
                </Button>
              </Link>
            );
          } else if (item.productionOrderId) {
            return (
              <Link href={`/production/orders/${item.productionOrderId}`}>
                <Button variant="solid" colorScheme="blue">
                  Production Order #{item.productionOrderId}
                </Button>
              </Link>
            );
          } else {
            return 'Manual update';
          }
        })()}
      </Td>
    </Tr>
  );
}
