import { NAV } from "./nav.model";
import { Company } from "./company.model";

export interface Portfolio {
  portfolioId: number;
  investmentType: string;
  netAssetValue: NAV;
  quantity: number;
  lastTradedPrice: number;
  investedAmount: number;
  profitLoss: number;
  exitCharges: number;
  updatedTime: string;
  company: Company;
}
