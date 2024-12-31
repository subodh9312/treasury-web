import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tax } from '../models/tax.model';
import { TaxApplicability } from '../models/tax.applicability.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  getAllTaxes(page, size) {
    return this.http.get<{ content: Tax[], totalElements: number; }>(this.baseUrl + "/taxes/", {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  addTax(tax: Tax) {
    return this.http.post<Tax>(this.baseUrl + "/taxes/add", tax);
  }

  modifyTax(tax: Tax) {
    return this.http.put<Tax>(this.baseUrl + "/taxes/modify", tax);
  }

  deleteTax(taxId: number) {
    return this.http.delete(this.baseUrl + "/taxes/remove/" + taxId);
  }

  deleteTaxApplicability(taxApplicabilityId: number) {
    return this.http.delete(this.baseUrl + "/taxes/remove/taxApplicability/" + taxApplicabilityId);
  }

  addTaxApplicability(taxApplicability: TaxApplicability) {
    return this.http.post<TaxApplicability>(this.baseUrl + "/taxes/addApplicability", taxApplicability);
  }

  getAllTaxApplicabilityForTax(taxId: number) {
    return this.http.get<{ content: TaxApplicability[]; }>(this.baseUrl + "/taxes/applicabilities/" + taxId);
  }

}
