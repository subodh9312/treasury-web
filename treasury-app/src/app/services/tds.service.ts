import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TdsApplicability } from '../models/tds-applicability.model';
import { TaxApplicability } from '../models/tax.applicability.model';

@Injectable({
  providedIn: 'root'
})
export class TdsService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  getAllTdsApplicabilities(page, size) {
    return this.http.get<{ content: TdsApplicability[], totalElements: number; }>(this.baseUrl + "/tdsApplicabilities/", {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  addTdsApplicability(tds: TdsApplicability) {
    return this.http.post<TdsApplicability>(this.baseUrl + "/tdsApplicabilities/add", tds);
  }

  modifyTdsApplicability(tds: TdsApplicability) {
    return this.http.put<TdsApplicability>(this.baseUrl + "/tdsApplicabilities/modify", tds);
  }

  deleteTdsApplicability(taxId: number) {
    return this.http.delete(this.baseUrl + "/tdsApplicabilities/remove/" + taxId);
  }
}
