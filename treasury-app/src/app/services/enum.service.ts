import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  getCountries() {
    return this.http.get<[]>(this.baseUrl + "/enum/countries");
  }

  getCurrencies() {
    return this.http.get<[]>(this.baseUrl + "/enum/currencies");
  }

  getHoldingIntentions() {
    return this.http.get<[]>(this.baseUrl + "/enum/holdingIntentions");
  }

  getCounterPartyClassifications() {
    return this.http.get<[]>(this.baseUrl + "/enum/counterPartyClassifications");
  }

  getCreditRatings() {
    return this.http.get<[]>(this.baseUrl + "/enum/creditRatings");
  }

  getTransactionFrequencies() {
    return this.http.get<[]>(this.baseUrl + "/enum/transactionFrequencies");
  }

  getInvestmentTypes() {
    return this.http.get<[]>(this.baseUrl + "/enum/investmentTypes");
  }

  getTransactionSides() {
    return this.http.get<[]>(this.baseUrl + "/enum/transactionSides");
  }

  getConventionalDays() {
    return this.http.get<[]>(this.baseUrl + "/enum/conventionalDays");
  }
  getCompoundingTypes() {
    return this.http.get<[]>(this.baseUrl + "/enum/compoundingTypes")
  }
  getLoanTypes() {
    return this.http.get<[]>(this.baseUrl + "/enum/loanTypes");
  }
  getLoanTransactionTypes(borrowing: boolean) {
    return this.http.get<[]>(this.baseUrl + "/enum/loanTransactionTypes/" + borrowing)
  }
}
