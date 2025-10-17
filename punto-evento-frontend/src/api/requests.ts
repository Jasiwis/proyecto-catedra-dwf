import axiosClient from "../lib/axios-client";

export interface Request {
  id: string;
  clientId: string;
  eventDate: string;
  location: string;
  requestedServices: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestRequest {
  eventDate: string;
  location: string;
  requestedServices: string;
  notes?: string;
}

export interface RequestResponse {
  data: Request;
  message: string;
  success: boolean;
}

export interface RequestsListResponse {
  data: Request[];
  message: string;
  success: boolean;
}

export const requestsApi = {
  // Crear nueva solicitud
  createRequest: async (
    requestData: CreateRequestRequest
  ): Promise<RequestResponse> => {
    const response = await axiosClient.post("/requests", requestData);
    return response.data;
  },

  // Obtener todas las solicitudes del cliente actual
  getMyRequests: async (): Promise<RequestsListResponse> => {
    const response = await axiosClient.get("/requests/my-requests");
    return response.data;
  },

  // Obtener solicitud por ID
  getRequestById: async (id: string): Promise<RequestResponse> => {
    const response = await axiosClient.get(`/requests/${id}`);
    return response.data;
  },

  // Actualizar estado de solicitud (solo admin)
  updateRequestStatus: async (
    id: string,
    status: string
  ): Promise<RequestResponse> => {
    const response = await axiosClient.patch(`/requests/${id}/status`, {
      status,
    });
    return response.data;
  },
};
