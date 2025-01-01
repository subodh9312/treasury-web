import { Investment } from "./investment.model";
import { NAV } from "./nav.model";

export interface MutualFundInvestment extends Investment {
  netAssetValue: NAV;
  transactionNav: number;
  exitLoadPercentage: number;
  exitLoadApplicableMinimumDuration: number;
  leinMarkedAmount: number;
  leinMarkedUtilitzationAmount: number;
  mutualFundInvestmentMethod: string;
  periodOfInvestment: number;
}

