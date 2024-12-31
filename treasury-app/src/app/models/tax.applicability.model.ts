import { Tax } from "./tax.model";
import { InvestmentType} from "../enums/investment-type.enum";

export interface TaxApplicability {
    taxApplicabilityId: number;
    tax: Tax;
    investmentType: InvestmentType;
    transactionSidesApplicable: Set<string>;
    effectiveDate: string;
    taxPercent: number;
}