import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { onMainScreen } from '../animations/animations';
import { PortfolioService } from '../services/portfolio.service';
import { InvestmentType } from '../enums/investment-type.enum';
import { CompanyService } from '../services/company.service';
import { Company } from '../models/company.model';
import { Constants } from '../util/constants.component';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexNonAxisChartSeries, ApexTitleSubtitle } from 'ng-apexcharts';
import { MutualFundPortfolio } from '../models/mutual-fund-portfolio.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [onMainScreen]
})
export class HomeComponent implements OnInit, OnDestroy {

  isUserAuthenticated: boolean = false;
  private authStatusSubscription: Subscription;
  companySelected: boolean = false;
  companies: Company[];
  mfPortfolios: MutualFundPortfolio[];

  chartSeries: ApexNonAxisChartSeries = [];
  chartLabels;
  chartDataLabels: ApexDataLabels = {
    enabled: false
  };
  chartDetails: ApexChart = {
    type: 'pie',
    toolbar: {
      show: true
    } 
  };

  chartTitle: ApexTitleSubtitle = {
    text: 'Mutual Funds Investment Amount By Fund Type',
    align: 'center'
  };

  constructor(private authService: AuthService,
    private portfolioService: PortfolioService,
    private companyService: CompanyService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isUserAuthenticated = authStatus;
    });
    this.authService.autoAuthUser();

    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(res => this.companies = res.content);
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

  compareObjects(object1: any, object2: any) {
    let key = "name";
    if (object1.schemeName != undefined) {
      key = "schemeName";
    } else if (object1.accountNumber != undefined) {
      key = "accountNumber";
    }
    return object1 && object2 && object1[key] == object2[key];
  }

  onCompanySelected(event){    
    this.portfolioService.getMutualFundPortfolioByCompanyAndFundType(event).subscribe(res => {
      this.mfPortfolios = res;
      this.chartSeries = this.mfPortfolios.map(mf => mf.investedAmount);
      this.chartLabels = this.mfPortfolios.map(mf => mf.fundType);
      this.companySelected = true;
  })
}
}
