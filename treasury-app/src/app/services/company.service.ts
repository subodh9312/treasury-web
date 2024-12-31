import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  addCompany(company: Company) {
    return this.http.post<Company>(this.baseUrl + "/companies/add", company);
  }

  modifyCompany(company: Company) {
    return this.http.put<Company>(this.baseUrl + "/companies/modify", company);
  }

  deleteCompany(companyId: number) {
    return this.http.delete(this.baseUrl + "/companies/remove/" + companyId);
  }

  getAllCompanies(page, size) {
    return this.http.get<{ content: Company[], totalElements: number;}>(this.baseUrl + "/companies/", {
      params: {
        "page": page,
        "size": size
      }
    });
  }
  getCompanyAccounts(companyId: number) {
    return this.http.get<Account[]>(this.baseUrl + "/companies/" + companyId+"/accounts");
  }
}
