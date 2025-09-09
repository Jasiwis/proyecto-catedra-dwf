// =====================
// Enums
// =====================

export enum PersonType {
  Natural = "Natural",
  Juridica = "Jurídica",
}

export enum Status {
  Activo = "Activo",
  Inactivo = "Inactivo",
}

export enum ContractType {
  Permanente = "Permanente",
  PorHoras = "Por Horas",
}

export enum QuoteStatus {
  EnProceso = "En proceso",
  Finalizada = "Finalizada",
  Cancelada = "Cancelada",
}

// =====================
// Auth Interfaces
// =====================

export interface UserDto {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse extends UserDto {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

// =====================
// Client Interfaces
// =====================

export interface ClientDto {
  name: string;
  document: string;
  person_type: PersonType;
  phone?: string;
  email?: string;
  address?: string;
  status?: Status;
}

export interface ClientResponse extends ClientDto {
  id: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  deactivated_at?: string;
}

// =====================
// Employee Interfaces
// =====================

export interface EmployeeDto {
  name: string;
  document: string;
  person_type: PersonType;
  contract_type: ContractType;
  phone?: string;
  email?: string;
  address?: string;
  status?: Status;
}

export interface EmployeeResponse extends EmployeeDto {
  id: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  deactivated_at?: string;
}

// =====================
// Quote Interfaces
// =====================

export interface QuoteDto {
  client_id: string;
  estimated_hours?: number;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  additional_costs?: number;
  status?: QuoteStatus;
}

export interface QuoteResponse extends QuoteDto {
  id: string;
  created_at: string;
  updated_at?: string;
}

// =====================
// Assignment Interfaces
// =====================

export interface AssignmentDto {
  employee_id: string;
  title: string;
  start_datetime: string; // ISO 8601
  end_datetime: string; // ISO 8601
  estimated_hours?: number;
  base_cost?: number;
  extra_percentage?: number;
}

export interface AssignmentResponse extends AssignmentDto {
  id: string;
  quote_id: string;
  created_at: string;
  updated_at?: string;
}

// =====================
// Task Interfaces
// =====================

export interface TaskDto {
  title: string;
  description?: string;
}

export interface TaskResponse extends TaskDto {
  id: string;
  assignment_id: string;
  created_at: string;
  updated_at?: string;
}

// =====================
// Standard API Response
// =====================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    field: string;
    message?: string;
  }[];
}
