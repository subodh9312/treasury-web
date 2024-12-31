import { Address } from "./address.model";

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  address: Address;
  mobileNumber: string;
  workPhone: string;
  emailId: string;
}
