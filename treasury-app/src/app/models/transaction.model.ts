import { Account } from "./account.model";
import { Portfolio } from "./portfolio.model";

export interface Transaction {
  transactionAmount: number;
  transactionSide: string;
  quantity: number;
  transactionDate: string;
  valueDate: string;
  debitAccount: Account;
  updatedTime: string;
  transactionStatus: string;
  holdingIntention: string;
  countryOfInvestment: string;
  portfolio: Portfolio;
  transactionFrequency: string;
  nextValueDate: string;
  endDate: string;
}
