import type { ApiResponse } from "../interfaces/api.interface";
import type { QuoteDto, QuoteResponse } from "../interfaces/quote.interface";

import axiosClient from "../lib/axios-client";

export const getAllQuotations = async (): Promise<
  ApiResponse<QuoteResponse[]>
> => {
  const response = await axiosClient.get<ApiResponse<QuoteResponse[]>>(
    "/api/quotes"
  );
  return response.data;
};

export const getQuoteById = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.get<ApiResponse<QuoteResponse>>(
    `/api/quotes/${quoteId}`
  );
  return response.data;
};

export const createQuote = async (
  data: QuoteDto
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.post<ApiResponse<QuoteResponse>>(
    "/api/quotes",
    data
  );
  return response.data;
};

export const updateQuote = async (
  quoteId: string,
  data: QuoteDto
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `/api/quotes/${quoteId}`,
    data
  );
  return response.data;
};

export const finishQuote = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `/api/quotes/finish/${quoteId}`
  );
  return response.data;
};

export const cancelQuote = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `/api/quotes/cancel/${quoteId}`
  );
  return response.data;
};

export const getClientQuotes = async (
  clientId: string
): Promise<ApiResponse<QuoteResponse[]>> => {
  const response = await axiosClient.get<ApiResponse<QuoteResponse[]>>(
    `/api/quotes/client/${clientId}`
  );
  return response.data;
};

export const getMyQuotes = async (params?: {
  q?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiResponse<QuoteResponse[]>> => {
  const response = await axiosClient.get<ApiResponse<QuoteResponse[]>>(
    "/api/quotes/my-quotes",
    { params }
  );
  return response.data;
};

export const approveQuote = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `/api/quotes/approve/${quoteId}`
  );
  return response.data;
};

export const rejectQuote = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `/api/quotes/reject/${quoteId}`
  );
  return response.data;
};

// Aprobar o rechazar cotización con el nuevo flujo (crea reservación automáticamente)
export const approveOrRejectQuote = async (
  quoteId: string,
  action: "APROBAR" | "RECHAZAR",
  notes?: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.post<ApiResponse<QuoteResponse>>(
    `/api/quotes/${quoteId}/action`,
    { action, notes }
  );
  return response.data;
};
