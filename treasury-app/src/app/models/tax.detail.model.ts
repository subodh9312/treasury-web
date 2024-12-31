import { Tax } from "./tax.model";

export interface TaxDetail {
    tax: Tax;
    transactionAmount: number;
    taxAmount: number;
    taxPercent: number;
}