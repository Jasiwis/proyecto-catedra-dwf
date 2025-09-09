import { PersonType } from "../enums/person-type.enum";
import type { Status } from "../enums/status.enum";

export interface ClientDto {
  name: string;
  document: string;
  personType: PersonType;
  phone: string;
  email: string;
  address: string;
  status: Status;
}

export interface ClientResponse extends ClientDto {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  deactivatedAt?: string;
}
