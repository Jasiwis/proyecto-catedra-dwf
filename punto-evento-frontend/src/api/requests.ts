import axiosClient from "../lib/axios-client";

export interface Request {
  id: string;
  clientId: string;
  eventName: string;
  eventDate: string;
  location: string;
  requestedServices: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestRequest {
  eventName: string;
  eventDate: string;
  location: string;
  requestedServices: string[]; // backend espera lista que se convierte en join
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
    const response = await axiosClient.post("/api/requests", requestData);
    return response.data;
  },

  // Obtener todas las solicitudes del cliente actual
  getMyRequests: async (params?: {
    q?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<RequestsListResponse> => {
    const response = await axiosClient.get("/api/requests/my-requests", {
      params,
    });
    return response.data;
  },

  // Obtener solicitud por ID
  getRequestById: async (id: string): Promise<RequestResponse> => {
    const response = await axiosClient.get(`/api/requests/${id}`);
    return response.data;
  },

  // Actualizar estado de solicitud (solo admin)
  updateRequestStatus: async (
    id: string,
    status: string
  ): Promise<RequestResponse> => {
    const response = await axiosClient.patch(
      `/api/requests/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  },

  // Obtener todas las solicitudes (admin)
  getAllRequests: async (): Promise<RequestsListResponse> => {
    const response = await axiosClient.get("/api/requests");
    return response.data;
  },

  // Obtener cotizaciones de una solicitud
  getRequestQuotes: async (requestId: string): Promise<any> => {
    const response = await axiosClient.get(`/api/requests/${requestId}/quotes`);
    return response.data;
  },

  // Crear cotización desde solicitud (admin)
  createQuoteFromRequest: async (requestId: string): Promise<any> => {
    const response = await axiosClient.post(
      `/api/requests/${requestId}/create-quote`
    );
    return response.data;
  },
};
