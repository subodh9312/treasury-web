import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './admin/accounts/accounts.component';
import { AdminComponent } from './admin/admin.component';
import { CompaniesComponent } from './admin/companies/companies.component';
import { CounterpartyComponent } from './admin/counterparty/counterparty.component';
import { AuthorityComponent } from './admin/authorities/authority.component';
import { TaxesComponent } from './admin/taxes/taxes.component';
import { TdsApplicabilitiesComponent } from './admin/tds-applicabilities/tds-applicabilities.component';
import { UsersComponent } from './admin/users/users.component';
import { AuthGuard } from './auth/auth-guard';
import { LoginComponent } from './auth/login/login.component';
import { LoansMasterComponent } from './borrowings/loans-master/loans-master.component';
import { HomeComponent } from './home/home.component';
import { FixedDepositsComponent } from './investments/fixed-deposits/fixed-deposits.component';
import { InvestmentsComponent } from './investments/investments.component';
import { MutualFundsComponent } from './investments/mutual-funds/mutual-funds.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ["TREASURY_ADMIN", "SYSTEM_ADMIN"]
    }
  },
  { path: 'user', component: UserComponent },
  { path: 'investments', component: InvestmentsComponent },
  { path: 'mutualfunds', component: MutualFundsComponent },
  { path: 'fixeddeposits', component: FixedDepositsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'authorities', component: AuthorityComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'counterparty', component: CounterpartyComponent },
  { path: 'taxation', component: TaxesComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'tds', component: TdsApplicabilitiesComponent },
  { path: 'loanavailed', component: LoansMasterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
