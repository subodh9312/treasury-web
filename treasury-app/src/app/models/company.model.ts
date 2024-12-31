import { Address } from "./address.model";
import { Person } from "./person.model";

export interface Company {
  companyId: number;
  name: string;
  gstNumber: string;
  pan: string;
  accountingCurrency: string;
  primaryContact: Person;
  legalEntityIdentifier: string;
  address: Address;
}
