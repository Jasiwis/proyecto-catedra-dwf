import axiosClient from "../lib/axios-client";

// Estructura optimizada sin data anidada innecesaria
export interface ReservationDetail {
  // Información de la Reservación
  id: string;
  eventName: string;
  scheduledFor: string;
  location: string;
  status: string;
  progressPercentage: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Cliente (solo datos necesarios)
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  // Cotización (solo datos necesarios)
  quote: {
    id: string;
    eventName: string;
    estimatedHours?: number;
    subtotal: number;
    taxTotal: number;
    additionalCosts: number;
    total: number;
    status: string;
  };

  // Solicitud (solo datos necesarios)
  request?: {
    id: string;
    eventName: string;
    eventDate: string;
    location: string;
    requestedServices: string;
    notes?: string;
  };

  // Servicios de la cotización
  services: ServiceInfo[];

  // Tareas de la reservación
  tasks: TaskInfo[];
}

export interface ServiceInfo {
  id: string;
  description: string;
  quantity: number; // Se maneja como number en el frontend aunque sea BigDecimal en el backend
  unitPrice: number;
  total: number;
}

export interface TaskInfo {
  id: string;
  title: string;
  description?: string;
  status: string;
  employeeName?: string;
  startDatetime?: string;
  endDatetime?: string;
  completedAt?: string;
}

export interface CreateReservationRequest {
  quoteId: string;
  eventName: string;
  scheduledFor: string;
  location: string;
  notes?: string;
}

export interface ReservationResponse {
  data: ReservationDetail;
  message: string;
  success: boolean;
}

export interface ReservationsListResponse {
  data: ReservationDetail[];
  message: string;
  success: boolean;
}

export const reservationsApi = {
  // Crear nueva reserva (solo admin)
  createReservation: async (
    reservationData: CreateReservationRequest
  ): Promise<ReservationResponse> => {
    const response = await axiosClient.post(
      "/api/reservations",
      reservationData
    );
    return response.data;
  },

  // Obtener todas las reservas del cliente actual
  getMyReservations: async (params?: {
    q?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ReservationsListResponse> => {
    const response = await axiosClient.get(
      "/api/reservations/my-reservations",
      {
        params,
      }
    );
    return response.data;
  },

  // Obtener todas las reservas (solo admin)
  getAllReservations: async (): Promise<ReservationsListResponse> => {
    const response = await axiosClient.get("/api/reservations");
    return response.data;
  },

  // Obtener reserva por ID
  getReservationById: async (id: string): Promise<ReservationResponse> => {
    const response = await axiosClient.get(`/api/reservations/${id}`);
    return response.data;
  },

  // Actualizar progreso de reserva
  updateReservationProgress: async (
    id: string,
    progress: number
  ): Promise<ReservationResponse> => {
    const response = await axiosClient.patch(
      `/api/reservations/${id}/progress`,
      {
        progress,
      }
    );
    return response.data;
  },

  // Actualizar estado de reserva
  updateReservationStatus: async (
    id: string,
    status: string
  ): Promise<ReservationResponse> => {
    const response = await axiosClient.patch(`/api/reservations/${id}/status`, {
      status,
    });
    return response.data;
  },

  // Publicar reservación (EN_PLANEACION -> PROGRAMADA)
  publishReservation: async (id: string): Promise<ReservationResponse> => {
    const response = await axiosClient.post(`/api/reservations/${id}/publish`);
    return response.data;
  },
};
