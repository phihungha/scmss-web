import apiClient from '../utils/client-api';
import {
  IRequisitionResponse,
  IRequisitionsResponse,
} from '../types/requisition';

export const getAllRequisitions = async () => {
  const response =
    await apiClient.get<IRequisitionsResponse>(`PurchaseRequisitions`);
  return response.data;
};

export const getSalesOrder = async (id: string) => {
  const response = await apiClient.get<IRequisitionResponse>(
    `PurchaseRequisitions/${id}`,
  );
  return response.data;
};

export const createSalesOrder = async (requisition: IRequisitionResponse) => {
  const response = await apiClient.post<IRequisitionResponse>(
    `PurchaseRequisitions`,
    requisition,
  );
  return response.data;
};

export const updateSalesOrder = async ({
  id,
  requisition,
}: {
  id: string;
  requisition: IRequisitionResponse;
}) => {
  const response = await apiClient.patch<IRequisitionResponse>(
    `PurchaseRequisitions/${id}`,
    requisition,
  );
  return response.data;
};