import { Investment } from './investment.model';
import { CounterParty } from './counterparty.model';
import { InterestRate } from './interest-rate.model';
import { InterestDependent } from './interest-dependent.model';

export  interface FixedDepositInvestment extends InterestDependent {
    fdrNumber: string;
    leinMarkedAmount: number;
    leinMarkedUtilitzationAmount: number;
    callable: string;
    floating: string;
    preClosureDate: string;
}