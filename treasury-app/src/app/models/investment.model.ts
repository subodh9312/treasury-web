import { Audit } from "./audit.model";
import { Transaction } from "./transaction.model";
import { Company } from "./company.model";
import { TaxDetail } from "./tax.detail.model";

export interface Investment extends Audit {
  investmentId: number;
  transaction: Transaction;
  company: Company;
  readonly taxDetails: TaxDetail[];
}
