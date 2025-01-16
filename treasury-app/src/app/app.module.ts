import { BrowserModule } from '@angular/platform-browser';
import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule, HttpXsrfTokenExtractor } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';

import { NgApexchartsModule } from 'ng-apexcharts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthorityComponent } from './admin/authorities/authority.component';
import { CreateAuthorityComponent } from './admin/authorities/create-authority/create-authority.component';
import { AuthorityListComponent } from './admin/authorities/authority-list/authority-list.component';
import { UserListComponent } from './admin/users/user-list/user-list.component';
import { CreateUserComponent } from './admin/users/create-user/create-user.component';
import { UserComponent } from './user/user.component';
import { MyProfileComponent } from './user/my-profile/my-profile.component';
import { ChangePasswordComponent } from './user/change-password/change-password.component';
import { CompanyListComponent } from './admin/companies/company-list/company-list.component';
import { AddCompanyComponent } from './admin/companies/add-company/add-company.component';
import { AddPersonComponent } from './admin/person/add-person/add-person.component';
import { AddAccountComponent } from './admin/accounts/add-account/add-account.component';
import { AccountListComponent } from './admin/accounts/account-list/account-list.component';
import { PendingAccountsComponent } from './admin/accounts/pending-accounts/pending-accounts.component';
import { CustomTooltip } from './util/custom-tooltip.component';
import { CheckboxComponent } from './util/checkbox.component';
import { MultiSelectComponent } from './util/multiselect.component';
import { PendingUsersComponent } from './admin/users/pending-users/pending-users.component';
import { HomeComponent } from './home/home.component';
import { InvestmentsComponent } from './investments/investments.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BuyMutualFundComponent } from './investments/mutual-funds/buy-mutual-fund/buy-mutual-fund.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { UsersComponent } from './admin/users/users.component';
import { AccountsComponent } from './admin/accounts/accounts.component';
import { CompaniesComponent } from './admin/companies/companies.component';
import { FooterComponent } from './footer/footer.component';
import { MutualFundsComponent } from './investments/mutual-funds/mutual-funds.component';
import { RecentTransactionsComponent } from './investments/mutual-funds/recent-transactions/recent-transactions.component';
import { PendingTransactionsComponent } from './investments/mutual-funds/pending-transactions/pending-transactions.component';
import { SellMutualFundComponent } from './investments/mutual-funds/sell-mutual-fund/sell-mutual-fund.component';
import { AddCounterpartyComponent } from './admin/counterparty/add-counterparty/add-counterparty.component';
import { CounterpartyListComponent } from './admin/counterparty/counterparty-list/counterparty-list.component';
import { CounterpartyComponent } from './admin/counterparty/counterparty.component';
import { AddTaxComponent } from './admin/taxes/add-tax/add-tax.component';
import { TaxesComponent } from './admin/taxes/taxes.component';
import { TaxesListComponent } from './admin/taxes/taxes-list/taxes-list.component';
import { AddTaxApplicabilityComponent } from './admin/taxes/add-tax-applicability/add-tax-applicability.component';
import { TaxApplicabilityListComponent } from './admin/taxes/tax-applicability-list/tax-applicability-list.component';
import { FixedDepositsComponent } from './investments/fixed-deposits/fixed-deposits.component';
import { BuyFixedDepositComponent } from './investments/fixed-deposits/buy-fixed-deposit/buy-fixed-deposit.component';
import { SellFixedDepositComponent } from './investments/fixed-deposits/sell-fixed-deposit/sell-fixed-deposit.component';
import { FdRecentTransactionsComponent } from './investments/fixed-deposits/fd-recent-transactions/fd-recent-transactions.component';
import { FdPendingTransactionsComponent } from './investments/fixed-deposits/fd-pending-transactions/fd-pending-transactions.component';
import { InterestDetailListComponent } from './investments/interest-detail-list/interest-detail-list.component';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { TdsApplicabilitiesComponent } from './admin/tds-applicabilities/tds-applicabilities.component';
import { AddTdsApplicabilityComponent } from './admin/tds-applicabilities/add-tds-applicability/add-tds-applicability.component';
import { TdsApplicabilitiesListComponent } from './admin/tds-applicabilities/tds-applicabilities-list/tds-applicabilities-list.component';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { NavService } from "./nav.service";
import { AddInterestRateComponent } from './investments/add-interest-rate/add-interest-rate.component';
import { InterestRatesListComponent } from './investments/interest-rates-list/interest-rates-list.component';
import { LoansMasterComponent } from './borrowings/loans-master/loans-master.component';
import { LoansMasterListComponent } from './borrowings/loans-master/loans-master-list/loans-master-list.component';
import { AddLoanComponent } from './borrowings/loans-master/add-loan/add-loan.component';
import { FdLiquidatedTransactionsComponent } from './investments/fixed-deposits/fd-liquidated-transactions/fd-liquidated-transactions.component';
import { AddLoanTransactionComponent } from './borrowings/loans-master/add-loan-transaction/add-loan-transaction.component';
import { LoanTransactionDetailsComponent } from './borrowings/loans-master/loan-transaction-details/loan-transaction-details.component';
import { CloseLoanComponent } from './borrowings/loans-master/close-loan/close-loan.component';
import { ClosedLoansListComponent } from './borrowings/loans-master/closed-loans-list/closed-loans-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavHeaderComponent,
    LoginComponent,
    AdminComponent,
    UserListComponent,
    CreateUserComponent,
    AuthorityComponent,
    CreateAuthorityComponent,
    AuthorityListComponent,
    UserComponent,
    MyProfileComponent,
    ChangePasswordComponent,
    CompanyListComponent,
    AddCompanyComponent,
    AddPersonComponent,
    AddAccountComponent,
    AccountListComponent,
    PendingAccountsComponent,
    CustomTooltip,
    CheckboxComponent,
    MultiSelectComponent,
    PendingUsersComponent,
    HomeComponent,
    InvestmentsComponent,
    BuyMutualFundComponent,
    UsersComponent,
    AccountsComponent,
    CompaniesComponent,
    FooterComponent,
    MutualFundsComponent,
    RecentTransactionsComponent,
    PendingTransactionsComponent,
    SellMutualFundComponent,
    AddCounterpartyComponent,
    CounterpartyListComponent,
    CounterpartyComponent,
    AddTaxComponent,
    TaxesComponent,
    TaxesListComponent,
    AddTaxApplicabilityComponent,
    TaxApplicabilityListComponent,
    FixedDepositsComponent,
    BuyFixedDepositComponent,
    SellFixedDepositComponent,
    FdRecentTransactionsComponent,
    FdPendingTransactionsComponent,
    InterestDetailListComponent,
    TdsApplicabilitiesComponent,
    AddTdsApplicabilityComponent,
    TdsApplicabilitiesListComponent,
    MenuListItemComponent,
    AddInterestRateComponent,
    InterestRatesListComponent,
    LoansMasterComponent,
    LoansMasterListComponent,
    AddLoanComponent,
    FdLiquidatedTransactionsComponent,
    AddLoanTransactionComponent,
    LoanTransactionDetailsComponent,
    CloseLoanComponent,
    ClosedLoansListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    NgApexchartsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    AgGridModule.withComponents([
      PendingAccountsComponent,
      AccountListComponent
    ]),
    NgxSpinnerModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
    CurrencyPipe, NavService, PercentPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
