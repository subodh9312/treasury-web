export interface CounterParty {
  counterPartyId: number;
  counterPartyName: string;
  counterPartyClassification: string;
  creditRating: number;
  enabledInvestmentTypes: Set<string>;
}
