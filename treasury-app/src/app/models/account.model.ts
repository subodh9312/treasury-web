import { Person } from "./person.model";
import { Company } from "./company.model";
import { Audit } from "./audit.model";

export interface Account extends Audit {
  accountId: number;
  accountNumber: string;
  nickname: string;
  bankName: string;
  ifscCode: string;
  bankAccountGLCode: string;
  accountPurpose: string;
  primaryTeam: string;
  openingBalance: number;
  relationshipManager: Person;
  company: Company;
  accountCurrency: string;
  accountStatus: string;
}
