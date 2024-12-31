import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class LoansService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  getAllLoans(page, size) {
    return this.http.get<{ content: Loan[]; totalElements: number; }>(this.baseUrl + "/loans/", {
      params: {
        "page": page,
        "size": size,
        "sortBy": "referenceNumber"
      }
    });
  }
  addLoan(loan: Loan) {
    console.log(loan);
    return this.http.post(this.baseUrl + "/loans/add", loan);
  }

}
