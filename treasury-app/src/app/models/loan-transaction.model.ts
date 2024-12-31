export interface LoanTransaction {
    transactionDate: string;
    transactionAmount: number;
    loanTransactionType: string;
    closureTransaction: boolean,
    chargedInterestAmount: number;
    remark: string;
}