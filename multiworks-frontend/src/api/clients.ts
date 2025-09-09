import type { ApiResponse } from "../interfaces/api.interface";
import type { ClientDto, ClientResponse } from "../interfaces/client.interface";
import axiosClient from "../lib/axios-client";

export const getAllClients = async (): Promise<
  ApiResponse<ClientResponse[]>
> => {
  const response = await axiosClient.get<ApiResponse<ClientResponse[]>>(
    "clients"
  );
  return response.data;
};

export const getClientById = async (
  clientId: string
): Promise<ApiResponse<ClientResponse>> => {
  const response = await axiosClient.get<ApiResponse<ClientResponse>>(
    `clients/${clientId}`
  );
  return response.data;
};

export const createClient = async (
  data: ClientDto
): Promise<ApiResponse<ClientResponse>> => {
  const response = await axiosClient.post<ApiResponse<ClientResponse>>(
    "clients",
    data
  );
  return response.data;
};

export const updateClient = async (
  clientId: string,
  data: ClientDto
): Promise<ApiResponse<ClientResponse>> => {
  const response = await axiosClient.put<ApiResponse<ClientResponse>>(
    `clients/${clientId}`,
    data
  );
  return response.data;
};

export const updateClientStatus = async (
  clientId: string
): Promise<ApiResponse<ClientResponse>> => {
  const response = await axiosClient.put<ApiResponse<ClientResponse>>(
    `clients/status/${clientId}`
  );
  return response.data;
};
