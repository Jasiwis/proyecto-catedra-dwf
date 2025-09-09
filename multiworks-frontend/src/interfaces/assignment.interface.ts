export interface AssignmentDto {
  employeeId: string;
  title: string;
  startDatetime: string; // ISO 8601
  endDatetime: string; // ISO 8601
  estimatedHours: number;
  baseCost: number;
  extraPercentage: number;
}

export interface AssignmentResponse extends AssignmentDto {
  id: string;
  quoteId: string;
  createdAt: string;
  updatedAt?: string;
}
