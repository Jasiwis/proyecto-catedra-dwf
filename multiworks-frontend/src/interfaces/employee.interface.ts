import { ContractType } from "../enums/contract-type.enum";
import { PersonType } from "../enums/person-type.enum";
import type { Status } from "../enums/status.enum";

export interface EmployeeDto {
  name: string;
  document: string;
  personType: PersonType;
  contractType: ContractType;
  phone: string;
  email: string;
  address: string;
  status?: Status;
}

export interface EmployeeResponse extends EmployeeDto {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string;
}
