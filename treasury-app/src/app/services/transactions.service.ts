import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Investment } from "../models/investment.model";
import { WorkflowPendingTask } from "../models/workflow-pending-task.model";
import { WorkflowActionRequest } from "../models/workflow-action-request.model";
import { NAV } from "../models/nav.model";
import { MutualFundInvestment } from "../models/mutual-fund.model";
import { InvestmentType } from "../enums/investment-type.enum";
import { FixedDepositInvestment } from "../models/fixed-deposit.model";
import { InterestRate } from "../models/interest-rate.model";
import { Loan } from "../models/loan.model";
import { LoanTransaction } from "../models/loan-transaction.model";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  getAllFundFamilies() {
    return this.http.get<[]>(this.baseUrl + "/investments/nav/fundFamilies");
  }

  getAllNavsByFundFamily(fundFamily: string) {
    return this.http.get<NAV[]>(this.baseUrl + "/investments/nav/" + fundFamily);
  }

  reloadHistoricalNav() {
    return this.http.post(this.baseUrl + "/investments/nav/reload", new FormData());
  }

  addMutualFundInvestment(mutualFundInvestment: MutualFundInvestment) {
    return this.http.post(this.baseUrl + "/transactions/addMutualFundInvestment", mutualFundInvestment);
  }

  addNewLoan(loan: Loan) {
    return this.http.post(this.baseUrl + "/transactions/addLoan", loan);
  }

  getAllMutualFundsInvestment(page, size, activeOrClosed) {
    return this.http.get<{ content: MutualFundInvestment[], totalElements: number }>(this.baseUrl + "/transactions/" + InvestmentType.MUTUAL_FUNDS +"/" + activeOrClosed, {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  actionMutualFundTransaction(workflowActionRequest: WorkflowActionRequest<Investment>) {
    return this.http.post(this.baseUrl + "/transactions/actionMutualFundTransaction", workflowActionRequest);
  }

  getAllPendingTransactionsByInvestmentType(investmentType: string, page, size) {
    return this.http.get<{ content: WorkflowPendingTask<Investment>[], totalElements: number; }>(this.baseUrl + "/transactions/pending/" + investmentType, {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  uploadTransactionExcelFile(investmentType: string, file: File) {
    const formData = new FormData()
    formData.append('file', file, file.name);
    return this.http.post(this.baseUrl + "/transactions/" + investmentType.toString() + "/excel/upload", formData);
  }

  addFixedDepositInvestment(fixedDepositInvestment: FixedDepositInvestment) {
    return this.http.post(this.baseUrl + "/transactions/addFixedDepositInvestment", fixedDepositInvestment);
  }
  addInterestRate(investmentType:string,investmentId: string,addrate:InterestRate) {
    return this.http.post(this.baseUrl + "/transactions/interestrate/"+investmentType+"/"+investmentId+"/add",addrate);
  }

  addLoanTransaction(investmentType:string,investmentId: string,addLoan:LoanTransaction) {
    return this.http.post(this.baseUrl + "/transactions/"+investmentType+"/"+investmentId+"/addLoanTransaction",addLoan);
  }

  closeLoan(investmentType: string, investmentId: string, closureDate: string, closureAmount: string) {
    const formData = new FormData();
    formData.append('closureAmount', closureAmount);
    return this.http.post(this.baseUrl + "/transactions/"+investmentType+"/"+investmentId+"/closure/" + closureDate, formData);
  }

  getClosureAmountForLoanAsOn(investmentType: string, investmentId: string, closureDate: string) {
    return this.http.get(this.baseUrl + "/transactions/"+investmentType+"/"+investmentId+"/closure/" + closureDate);
  }

  updateInterestRate(investmentType:string,investmentId: string,UpdateRate:InterestRate) {
    return this.http.post(this.baseUrl + "/transactions/interestrate/"+investmentType+"/"+investmentId+"/update",UpdateRate);
  }

  actionFixedDepositTransaction(workflowActionRequest: WorkflowActionRequest<Investment>) {
    return this.http.post(this.baseUrl + "/transactions/actionFixedDepositTransaction", workflowActionRequest);
  }

  getAllFixedDepositInvestment(page, size, getActive) {
    return this.http.get<{ content: FixedDepositInvestment[]; }>(this.baseUrl + "/transactions/" + InvestmentType.FIXED_DEPOSITS + "/" + getActive , {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  getAllLoans(page, size, getActive) {
    return this.http.get<{ content: Loan[]; }>(this.baseUrl + "/transactions/" + InvestmentType.LOAN + "/" + getActive , {
      params: {
        "page": page,
        "size": size
      }
    });
  }
}
