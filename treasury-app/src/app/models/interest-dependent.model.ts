import { CounterParty } from "./counterparty.model";
import { Account } from "./account.model";
import { Company } from "./company.model";
import { Investment } from "./investment.model";
import { InterestRate } from "./interest-rate.model";

export interface InterestDependent extends Investment {
    counterParty: CounterParty;
    interestRate: number;
    conventionalDays: string;
    compoundingType: string;
    interestCalculationFactor: number;
    interestRates: InterestRate;
    preClosureDate: string;
}