export interface TaskDto {
  title: string;
  description?: string;
}

export interface TaskResponse extends TaskDto {
  id: string;
  assignmentId: string;
  createdAt: string;
  updatedAt?: string;
}
