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
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], data: { roles: ["TREASURY_ADMIN", "SYSTEM_ADMIN"]} },
  { path: 'investments', component: InvestmentsComponent, canActivate: [AuthGuard], data: { roles: ["TRANSACTIONS_MAKER", "TRANSACTIONS_VIEW", "TRANSACTIONS_VERIFIER", "TRANSACTIONS_AUTHORIZER", "SYSTEM_ADMIN" ]} },
  { path: 'mutualfunds', component: MutualFundsComponent, canActivate: [AuthGuard], data: { roles: ["TRANSACTIONS_MAKER", "TRANSACTIONS_VIEW", "TRANSACTIONS_VERIFIER", "TRANSACTIONS_AUTHORIZER", "SYSTEM_ADMIN"]}  },
  { path: 'fixeddeposits', component: FixedDepositsComponent, canActivate: [AuthGuard], data: { roles: ["TRANSACTIONS_MAKER", "TRANSACTIONS_VIEW", "TRANSACTIONS_VERIFIER", "TRANSACTIONS_AUTHORIZER", "SYSTEM_ADMIN"]}  },
  { path: 'users', component: UsersComponent },
  { path: 'authorities', component: AuthorityComponent, canActivate: [AuthGuard], data: { roles: ["SYSTEM_ADMIN"]} },
  { path: 'companies', component: CompaniesComponent },
  { path: 'counterparty', component: CounterpartyComponent },
  { path: 'taxation', component: TaxesComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'tds', component: TdsApplicabilitiesComponent },
  { path: 'loanavailed', component: LoansMasterComponent, canActivate: [AuthGuard], data: { roles: ["TRANSACTIONS_MAKER", "TRANSACTIONS_VIEW", "TRANSACTIONS_VERIFIER", "TRANSACTIONS_AUTHORIZER", "SYSTEM_ADMIN"]}  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
