import { OrderEventUpdateParams } from '../models/event';
import {
  ProductionOrder,
  ProductionOrderCreateParams,
  ProductionOrderEvent,
  ProductionOrderEventCreateParams,
  ProductionOrderUpdateParams,
} from '../models/production-order';
import apiClient from './client-api';

export async function getProductionOrders() {
  const response = await apiClient.get<ProductionOrder[]>(`ProductionOrders`);
  return response.data;
}

export async function getProductionOrder(id: number) {
  const response = await apiClient.get<ProductionOrder>(
    `ProductionOrders/${id}`,
  );
  return response.data;
}

export async function createProductionOrder(
  params: ProductionOrderCreateParams,
) {
  const response = await apiClient.post<ProductionOrder>(
    `ProductionOrders`,
    params,
  );
  return response.data;
}

export async function updateProductionOrder(
  id: number,
  params: ProductionOrderUpdateParams,
) {
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    params,
  );
  return response.data;
}

export async function approveProductionOrder(id: number) {
  const body = { approvalStatus: 'Approved' };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function rejectProductionOrder(id: number, problem: string) {
  const body = { approvalStatus: 'Rejected', problem };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function startProductionOrder(id: number) {
  const body = { status: 'Executing' };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function finishProductionOrder(id: number) {
  const body = { status: 'WaitingAcceptance' };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function completeProductionOrder(id: number) {
  const body = { status: 'Completed' };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function cancelProductionOrder(id: number, problem: string) {
  const body = { status: 'Canceled', problem };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function returnProductionOrder(id: number, problem: string) {
  const body = { status: 'Returned', problem };
  const response = await apiClient.patch<ProductionOrder>(
    `ProductionOrders/${id}`,
    body,
  );
  return response.data;
}

export async function createProductionOrderEvent(
  id: number,
  params: ProductionOrderEventCreateParams,
) {
  const response = await apiClient.post<ProductionOrderEvent>(
    `ProductionOrders/${id}/events`,
    params,
  );
  return response.data;
}

export async function updateProductionOrderEvent(
  id: number,
  eventId: number,
  params: OrderEventUpdateParams,
) {
  const response = await apiClient.patch<ProductionOrderEvent>(
    `ProductionOrders/${id}/events/${eventId}`,
    params,
  );
  return response.data;
}