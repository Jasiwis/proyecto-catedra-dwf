import type { ApiResponse } from "../interfaces/api.interface";
import type {
  AssignmentDto,
  AssignmentResponse,
} from "../interfaces/assignment.interface";

import axiosClient from "../lib/axios-client";

export const getAssignmentsByQuote = async (
  quoteId: string
): Promise<ApiResponse<AssignmentResponse[]>> => {
  const response = await axiosClient.get<ApiResponse<AssignmentResponse[]>>(
    `quotes/${quoteId}/assignments`
  );
  return response.data;
};

export const createAssignment = async (
  quoteId: string,
  data: AssignmentDto
): Promise<ApiResponse<AssignmentResponse>> => {
  const response = await axiosClient.post<ApiResponse<AssignmentResponse>>(
    `quotes/${quoteId}/assignments`,
    data
  );
  return response.data;
};

export const getAssignmentById = async (
  assignmentId: string
): Promise<ApiResponse<AssignmentResponse>> => {
  const response = await axiosClient.get<ApiResponse<AssignmentResponse>>(
    `assignments/${assignmentId}`
  );
  return response.data;
};

export const updateAssignment = async (
  assignmentId: string,
  data: AssignmentDto
): Promise<ApiResponse<AssignmentResponse>> => {
  const response = await axiosClient.put<ApiResponse<AssignmentResponse>>(
    `assignments/${assignmentId}`,
    data
  );
  return response.data;
};

export const deleteAssignment = async (
  assignmentId: string
): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete<ApiResponse<void>>(
    `assignments/${assignmentId}`
  );
  return response.data;
};
