import type { ApiResponse } from "../interfaces/api.interface";
import type { QuoteDto, QuoteResponse } from "../interfaces/quote.interface";

import axiosClient from "../lib/axios-client";

export const getAllQuotations = async (): Promise<
  ApiResponse<QuoteResponse[]>
> => {
  const response = await axiosClient.get<ApiResponse<QuoteResponse[]>>(
    "quotes"
  );
  return response.data;
};

export const getQuoteById = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.get<ApiResponse<QuoteResponse>>(
    `quotes/${quoteId}`
  );
  return response.data;
};

export const createQuote = async (
  data: QuoteDto
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.post<ApiResponse<QuoteResponse>>(
    "quotes",
    data
  );
  return response.data;
};

export const updateQuote = async (
  quoteId: string,
  data: QuoteDto
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `quotes/${quoteId}`,
    data
  );
  return response.data;
};

export const finishQuote = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `quotes/finish/${quoteId}`
  );
  return response.data;
};

export const cancelQuote = async (
  quoteId: string
): Promise<ApiResponse<QuoteResponse>> => {
  const response = await axiosClient.put<ApiResponse<QuoteResponse>>(
    `quotes/cancel/${quoteId}`
  );
  return response.data;
};
