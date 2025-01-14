import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserComponent } from '../user/user.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: '**', redirectTo: 'dashboard'},
  {path: 'user', component: UserComponent}
  // {path: 'investments', loadChildren: () => import('../investments/investments.module').then(m => m.InvestmentsModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
