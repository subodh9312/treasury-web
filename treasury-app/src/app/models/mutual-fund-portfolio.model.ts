import { Investment } from "./investment.model";

export interface MutualFundPortfolio extends Investment {
    profitLoss: number;
    investedAmount: number;
    currentMarketValue: number;
    fundType: string;
}
