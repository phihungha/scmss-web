import { Vendor } from '../types/requisition';
import { customerVendorInput, IVendorsResponse } from '../types/vendor';
import apiClient from '../utils/client-api';

export const getAllVendors = async () => {
  const response = await apiClient.get<IVendorsResponse>(`Vendors`);
  return response.data;
};

export const getVendor = async (id: string) => {
  const response = await apiClient.get<Vendor>(`Vendors/${id}`);
  return response.data;
};

export const createVendor = async (vendor: customerVendorInput) => {
  const response = await apiClient.post<Vendor>(`Vendors`, vendor);
  return response.data;
};

export const updateVendor = async (id: string, vendor: customerVendorInput) => {
  const response = await apiClient.patch<Vendor>(`Vendors/${id}`, vendor);
  return response.data;
};
