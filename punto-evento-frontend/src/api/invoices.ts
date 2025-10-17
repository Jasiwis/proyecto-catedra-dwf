import axiosClient from "../lib/axios-client";

export interface Invoice {
  id: string;
  reservationId: string;
  clientId: string;
  issueDate: string;
  status: string;
  subtotal: number;
  taxTotal: number;
  additionalCosts: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceResponse {
  data: Invoice;
  message: string;
  success: boolean;
}

export interface InvoicesListResponse {
  data: Invoice[];
  message: string;
  success: boolean;
}

export const invoicesApi = {
  // Generar factura para una reserva (solo admin)
  generateInvoice: async (reservationId: string): Promise<InvoiceResponse> => {
    const response = await axiosClient.post(
      `/invoices/generate/${reservationId}`
    );
    return response.data;
  },

  // Obtener todas las facturas del cliente actual
  getMyInvoices: async (): Promise<InvoicesListResponse> => {
    const response = await axiosClient.get("/invoices/my-invoices");
    return response.data;
  },

  // Obtener todas las facturas (solo admin)
  getAllInvoices: async (): Promise<InvoicesListResponse> => {
    const response = await axiosClient.get("/invoices");
    return response.data;
  },

  // Obtener factura por ID
  getInvoiceById: async (id: string): Promise<InvoiceResponse> => {
    const response = await axiosClient.get(`/invoices/${id}`);
    return response.data;
  },

  // Actualizar estado de factura
  updateInvoiceStatus: async (
    id: string,
    status: string
  ): Promise<InvoiceResponse> => {
    const response = await axiosClient.patch(`/invoices/${id}/status`, {
      status,
    });
    return response.data;
  },
};
