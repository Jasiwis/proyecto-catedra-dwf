import { QuoteStatus } from "../enums/quote-status.enum";
import { Client } from "./client.interface";

export interface QuoteItemDto {
  serviceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface QuoteItemResponse {
  id: string;
  serviceId?: string;
  serviceName?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  subtotal: number;
  total: number;
}

export interface QuoteDto {
  requestId?: string;
  clientId: string;
  eventName: string;
  estimatedHours: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  additionalCosts?: number;
  items: QuoteItemDto[];
  status?: QuoteStatus;
}

export interface Quote {
  id: string;
  requestId?: string;
  client: Client;
  eventName: string;
  startDate?: string;
  endDate?: string;
  subtotal: number;
  taxTotal: number;
  additionalCosts: number;
  total: number;
  status: QuoteStatus;
  items?: QuoteItemResponse[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteResponse extends QuoteDto {
  id: string;
  requestId?: string;
  eventName: string;
  subtotal?: number;
  taxTotal?: number;
  total?: number;
  items?: QuoteItemResponse[];
  createdAt: string;
  updatedAt?: string;
}
