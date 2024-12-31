import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CounterParty } from '../models/counterparty.model';

@Injectable({
  providedIn: 'root'
})
export class CounterPartyService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  getAllCounterParties(page, size) {
    return this.http.get<{ content: CounterParty[], totalElements: number; }>(this.baseUrl + "/counterparties/", {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  addCounterParty(counterParty: CounterParty) {
    return this.http.post<CounterParty>(this.baseUrl + "/counterparties/add", counterParty);
  }

  modifyCounterParty(counterParty: CounterParty) {
    return this.http.put<CounterParty>(this.baseUrl + "/counterparties/modify", counterParty);
  }

  deleteCounterParty(counterPartyId: number) {
    return this.http.delete(this.baseUrl + "/counterparties/remove/" + counterPartyId);
  }
  
  getEnabledCounterParties(investmentType:string) {
    return this.http.get<[]>(this.baseUrl + "/counterparties/enabled/"+investmentType);
  }

}

