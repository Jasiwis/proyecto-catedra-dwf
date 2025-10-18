import type { ApiResponse } from "../interfaces/api.interface";
import axiosClient from "../lib/axios-client";

export interface Task {
  id: string;
  reservationId: string;
  reservationEventName?: string;
  reservationLocation?: string;
  reservationScheduledFor?: string;
  clientName?: string;
  employeeId: string;
  employeeName?: string;
  serviceId?: string;
  title: string;
  description?: string;
  status: string;
  startDatetime?: string;
  endDatetime?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  reservationId: string;
  employeeId?: string; // Opcional ahora
  serviceId?: string;
  title: string;
  description?: string;
  startDatetime: string; // ISO 8601 format
  endDatetime: string; // ISO 8601 format
}

export interface TaskResponse {
  data: Task;
  message: string;
  success: boolean;
}

export interface TasksListResponse {
  data: Task[];
  message: string;
  success: boolean;
}

export const tasksApi = {
  // Crear nueva tarea
  createTask: async (taskData: CreateTaskRequest): Promise<TaskResponse> => {
    const response = await axiosClient.post("/tasks", taskData);
    return response.data;
  },

  // Obtener todas las tareas
  getAllTasks: async (): Promise<TasksListResponse> => {
    const response = await axiosClient.get("/tasks");
    return response.data;
  },

  // Obtener mis tareas (del empleado autenticado)
  getMyTasks: async (): Promise<TasksListResponse> => {
    const response = await axiosClient.get("/tasks/my-tasks");
    return response.data;
  },

  // Obtener tareas por reserva
  getTasksByReservation: async (
    reservationId: string
  ): Promise<TasksListResponse> => {
    const response = await axiosClient.get(
      `/tasks/reservation/${reservationId}`
    );
    return response.data;
  },

  // Obtener tareas por empleado
  getTasksByEmployee: async (
    employeeId: string
  ): Promise<TasksListResponse> => {
    const response = await axiosClient.get(`/tasks/employee/${employeeId}`);
    return response.data;
  },

  // Obtener tareas por estado
  getTasksByStatus: async (status: string): Promise<TasksListResponse> => {
    const response = await axiosClient.get(`/tasks/status/${status}`);
    return response.data;
  },

  // Obtener tarea por ID
  getTaskById: async (id: string): Promise<TaskResponse> => {
    const response = await axiosClient.get(`/tasks/${id}`);
    return response.data;
  },

  // Actualizar tarea
  updateTask: async (
    id: string,
    taskData: Partial<CreateTaskRequest>
  ): Promise<TaskResponse> => {
    const response = await axiosClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Actualizar estado de tarea
  updateTaskStatus: async (
    id: string,
    status: string
  ): Promise<TaskResponse> => {
    const response = await axiosClient.patch(
      `/tasks/${id}/status?status=${status}`
    );
    return response.data;
  },

  // Eliminar tarea
  deleteTask: async (id: string): Promise<TaskResponse> => {
    const response = await axiosClient.delete(`/tasks/${id}`);
    return response.data;
  },
};
