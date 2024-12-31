import { InvestmentType } from "../enums/investment-type.enum";
import { Company } from "./company.model";
import { CounterParty } from "./counterparty.model";

export interface TdsApplicability {
    tdsApplicabilityId: number;
    investmentType: InvestmentType;
    effectiveDate: string;
    tdsPercent: number;
    minimumTransactionAmount: number;
    counterParty: CounterParty;
    company: Company;
}