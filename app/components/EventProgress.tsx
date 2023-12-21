'use client';
import React, { useState } from 'react';
import { Stepper, useSteps, Text, Stack, Button } from '@chakra-ui/react';
import { EventInput } from '../types/sales';
import EventItem from './EventItem';
import { Event } from '@/app/types/sales';
import AddEventDialog from './AddEventDialog';
interface EventProps {
  events: Event[];
  orderId: string;
  setEvents: (events: Event[]) => void;
}

export default function EventProgress(params: EventProps) {
  const [addDialog, SetAddDialog] = React.useState(false);

  const openAddDialog = () => {
    SetAddDialog(true);
  };
  const closeAddDialog = () => {
    SetAddDialog(false);
  };
  const { activeStep } = useSteps({
    index: 0,
    count: params.events.length,
  });
  return (
    <Stack spacing={2}>
      <Text
        fontSize={'3xl'}
        color={'black.500'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
        mb={'4'}
      >
        Progress Details
      </Text>
      <Stepper orientation="vertical" index={activeStep} gap={0}>
        {params.events?.map((event, index) => (
          <EventItem key={index} event={event} orderId={params.orderId} />
        ))}
      </Stepper>
      <Button
        mt={4}
        onClick={() => openAddDialog()}
        colorScheme="blue"
        size="lg"
      >
        Add
      </Button>
      <AddEventDialog
        orderId={params.orderId}
        display={addDialog}
        setClose={closeAddDialog}
        displayEvents={params.events}
        setDisplayEvents={params.setEvents}
      />
    </Stack>
  );
}