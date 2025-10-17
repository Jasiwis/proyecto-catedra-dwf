import { QuoteStatus } from "../enums/quote-status.enum";

export interface QuoteDto {
  clientId: string;
  estimatedHours?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  additionalCosts?: number;
  status?: QuoteStatus;
}

export interface QuoteResponse extends QuoteDto {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
