import axiosClient from "../lib/axios-client";

export interface Reservation {
  id: string;
  quoteId: string;
  clientId: string;
  status: string;
  scheduledFor: string;
  location: string;
  notes?: string;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  quoteId: string;
  scheduledFor: string;
  location: string;
  notes?: string;
}

export interface ReservationResponse {
  data: Reservation;
  message: string;
  success: boolean;
}

export interface ReservationsListResponse {
  data: Reservation[];
  message: string;
  success: boolean;
}

export const reservationsApi = {
  // Crear nueva reserva (solo admin)
  createReservation: async (
    reservationData: CreateReservationRequest
  ): Promise<ReservationResponse> => {
    const response = await axiosClient.post("/reservations", reservationData);
    return response.data;
  },

  // Obtener todas las reservas del cliente actual
  getMyReservations: async (): Promise<ReservationsListResponse> => {
    const response = await axiosClient.get("/reservations/my-reservations");
    return response.data;
  },

  // Obtener todas las reservas (solo admin)
  getAllReservations: async (): Promise<ReservationsListResponse> => {
    const response = await axiosClient.get("/reservations");
    return response.data;
  },

  // Obtener reserva por ID
  getReservationById: async (id: string): Promise<ReservationResponse> => {
    const response = await axiosClient.get(`/reservations/${id}`);
    return response.data;
  },

  // Actualizar progreso de reserva
  updateReservationProgress: async (
    id: string,
    progress: number
  ): Promise<ReservationResponse> => {
    const response = await axiosClient.patch(`/reservations/${id}/progress`, {
      progress,
    });
    return response.data;
  },

  // Actualizar estado de reserva
  updateReservationStatus: async (
    id: string,
    status: string
  ): Promise<ReservationResponse> => {
    const response = await axiosClient.patch(`/reservations/${id}/status`, {
      status,
    });
    return response.data;
  },
};
