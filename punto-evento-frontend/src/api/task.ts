import type { ApiResponse } from "../interfaces/api.interface";
import type { TaskDto, TaskResponse } from "../interfaces/task.interface";

import axiosClient from "../lib/axios-client";

export const getTasksByAssignment = async (
  assignmentId: string
): Promise<ApiResponse<TaskResponse[]>> => {
  const response = await axiosClient.get<ApiResponse<TaskResponse[]>>(
    `assignments/${assignmentId}/tasks`
  );
  return response.data;
};

export const createTask = async (
  assignmentId: string,
  data: TaskDto
): Promise<ApiResponse<TaskResponse>> => {
  const response = await axiosClient.post<ApiResponse<TaskResponse>>(
    `assignments/${assignmentId}/tasks`,
    data
  );
  return response.data;
};

export const getTaskById = async (
  taskId: string
): Promise<ApiResponse<TaskResponse>> => {
  const response = await axiosClient.get<ApiResponse<TaskResponse>>(
    `tasks/${taskId}`
  );
  return response.data;
};

export const updateTask = async (
  taskId: string,
  data: TaskDto
): Promise<ApiResponse<TaskResponse>> => {
  const response = await axiosClient.put<ApiResponse<TaskResponse>>(
    `tasks/${taskId}`,
    data
  );
  return response.data;
};

export const deleteTask = async (
  taskId: string
): Promise<ApiResponse<void>> => {
  const response = await axiosClient.delete<ApiResponse<void>>(
    `tasks/${taskId}`
  );
  return response.data;
};
