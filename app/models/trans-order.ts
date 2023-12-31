import { OrderEvent, OrderEventCreateParams } from './event';
import { Order, OrderItem, OrderQueryParams, OrderUpdateParams } from './order';

export type TransOrderEventType =
  | 'Processing'
  | 'DeliveryStarted'
  | 'Left'
  | 'Arrived'
  | 'Delivered'
  | 'Completed'
  | 'PaymentDue'
  | 'PaymentCompleted'
  | 'Canceled'
  | 'Returned'
  | 'Interrupted';

export type TransOrderEventOption = 'Left' | 'Arrived' | 'Interrupted';

export interface TransOrderEvent extends OrderEvent {
  type: TransOrderEventType;
}

export interface TransOrderEventCreateParams extends OrderEventCreateParams {
  type: TransOrderEventOption;
}

export type PaymentStatus = 'Pending' | 'Due' | 'Completed' | 'Canceled';

export interface TransOrder extends Order {
  fromLocation: string;
  isPaymentCompleteAllowed: boolean;
  isToLocationUpdateAllowed: boolean;
  paymentStatus: PaymentStatus;
  remainingAmount: number;
  subTotal: number;
  toLocation: string;
  totalAmount: number;
  vatAmount: number;
  vatRate: number;
}

export interface TransOrderItem extends OrderItem {
  totalPrice: number;
  unitPrice: number;
}

export interface TransOrderPaymentCompleteParams extends OrderUpdateParams {
  payAmount: number;
}

export interface TransOrderQueryParams extends OrderQueryParams {
  paymentStatus?: PaymentStatus[];
}
