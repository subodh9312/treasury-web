import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InvestmentType } from '../enums/investment-type.enum';
import { Portfolio } from '../models/portfolio.model';  
import { Company } from '../models/company.model';
import { MutualFundPortfolio } from '../models/mutual-fund-portfolio.model';

@Injectable({
    providedIn: 'root'
  })
  export class PortfolioService {

    baseUrl = environment.baseUrl;
    constructor (private http: HttpClient) { }

    getMutualFundPortfolioByCompanyAndFundType(company: Company) {
        return this.http.post<MutualFundPortfolio[]>(this.baseUrl + "/portfolio/" + InvestmentType.MUTUAL_FUNDS.toLowerCase(), company);
      }
  }