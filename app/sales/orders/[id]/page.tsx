'use client';
import {
  completeSalesOrder,
  finishSalesOrder,
  getSalesOrder,
  updateSalesOrder,
} from '@/app/api/sales-order';
import CancelSalesDialog from '@/app/components/CancelSalesDialog';
import CompletePaymentDialog from '@/app/components/CompletePaymentDialog';
import PaymentInfo from '@/app/components/PaymentInfo';
import { NormalSpinner } from '@/app/components/spinners';
import { SectionText, TitleText } from '@/app/components/texts';
import { ProductionFacility } from '@/app/models/production-facility';
import { SalesOrder, SalesOrderItem } from '@/app/models/sales-order';
import { TransOrderEvent } from '@/app/models/trans-order';
import {
  AbsoluteCenter,
  Button,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ReturnSalesDialog from './components/ReturnSalesDialog';
import SalesOrderEventTimeline from './components/SalesOrderEventTimeline';
import SalesOrderInfo from './components/SalesOrderInfo';
import SalesOrderItemsEditor from './components/SalesOrderItemsEditor';

interface SalesOrderDetailsPageProps {
  params: {
    id: number;
  };
}

export default function SalesOrderDetailsPage({
  params,
}: SalesOrderDetailsPageProps) {
  const orderId = params.id;

  const queryClient = useQueryClient();
  const toast = useToast();

  const [facility, setFacility] = useState<ProductionFacility | undefined>();
  const [toLocation, setToLocation] = useState('');
  const [items, setItems] = useState<SalesOrderItem[]>([]);
  const [events, setEvents] = useState<TransOrderEvent[]>([]);

  const queryKey = ['salesOrder', orderId];

  const { data: order } = useQuery({
    queryKey,
    queryFn: () => getSalesOrder(orderId),
    onSuccess: (resp) => {
      setFacility(resp.productionFacility);
      setToLocation(resp.toLocation);

      if (resp.events) {
        setEvents(resp.events);
      }

      if (resp.items) {
        setItems(resp.items);
      }
    },
  });

  const { mutate: updateOrder } = useMutation(
    () =>
      updateSalesOrder({
        id: orderId,
        items,
        toLocation,
        productionFacilityId: facility?.id,
      }),
    {
      onSuccess: (resp: SalesOrder) => {
        queryClient.setQueryData(queryKey, resp);
        toast({
          title: 'Item updated!',
          description: 'Item has been updated successfully!',
          duration: 2000,
          status: 'success',
        });
      },
    },
  );

  const { mutate: completeOrder } = useMutation(
    () => completeSalesOrder(orderId),
    {
      onSuccess: (resp: SalesOrder) => {
        queryClient.setQueryData(queryKey, resp);
      },
    },
  );

  const { mutate: finishOrderDelivery } = useMutation(
    () => finishSalesOrder(orderId),
    {
      onSuccess: (resp: SalesOrder) => {
        queryClient.setQueryData(queryKey, resp);
      },
    },
  );

  const [paymentDialog, SetPaymentDialog] = useState(false);
  const [cancelDialog, SetCancelDialog] = useState(false);
  const [returnDialog, SetReturnDialog] = useState(false);

  if (order === undefined) {
    return (
      <AbsoluteCenter>
        <NormalSpinner />
      </AbsoluteCenter>
    );
  }

  const vatRate = order.vatRate;
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const vatAmount = totalPrice * vatRate;
  const totalAmount = totalPrice + vatAmount;

  return (
    <div className="p-5">
      <Stack spacing={10} direction={'column'}>
        <TitleText>Sales order #{order.id}</TitleText>

        <SalesOrderInfo
          order={order}
          facility={facility}
          onFacilitySelect={setFacility}
          toLocation={toLocation}
          onToLocationChange={setToLocation}
        />

        <SectionText>Items</SectionText>
        <SalesOrderItemsEditor items={items} onItemsChange={setItems} />

        <SectionText>Progress</SectionText>
        <SalesOrderEventTimeline events={events} orderId={order.id} />

        <PaymentInfo
          totalPrice={totalPrice}
          totalAmount={totalAmount}
          vatAmount={vatAmount}
          vatRate={vatRate}
        />

        <Stack spacing={5} direction="row">
          <Text as={'span'} fontWeight={'bold'} fontSize="3xl">
            Remaining Amount:
          </Text>
          <div className="flex grow items-end justify-end">
            <Text as={'span'} fontWeight={'bold'} fontSize="3xl">
              {order.remainingAmount}
            </Text>
          </div>
        </Stack>

        <div className="flex w-full flex-row justify-end gap-5 pt-10">
          <Button
            onClick={() => SetCancelDialog(true)}
            width={100}
            variant="solid"
            colorScheme="red"
            size="lg"
          >
            Cancel
          </Button>
          <CancelSalesDialog
            cancelDialog={cancelDialog}
            CancelClose={() => SetCancelDialog(false)}
            orderId={orderId}
          />

          <Button
            onClick={() => SetCancelDialog(true)}
            width={100}
            variant="solid"
            colorScheme="red"
            size="lg"
          >
            Return
          </Button>
          <ReturnSalesDialog
            orderId={orderId}
            returnDialog={returnDialog}
            returnClose={() => SetReturnDialog(false)}
          />

          <Button
            onClick={() => SetPaymentDialog(true)}
            variant="solid"
            colorScheme="purple"
            size="lg"
          >
            Complete Payment
          </Button>
          <CompletePaymentDialog
            orderId={orderId}
            paymentDialog={paymentDialog}
            handleClose={() => SetPaymentDialog(false)}
          />

          <Button
            onClick={() => finishOrderDelivery()}
            variant="solid"
            colorScheme="orange"
            size="lg"
          >
            Finish Delivery
          </Button>
          <Button
            width={100}
            variant="solid"
            colorScheme="green"
            size="lg"
            onClick={() => completeOrder()}
          >
            Complete
          </Button>
          <Button
            width={100}
            variant="solid"
            colorScheme="blue"
            size="lg"
            onClick={() => updateOrder()}
          >
            Update
          </Button>
        </div>
      </Stack>
    </div>
  );
}