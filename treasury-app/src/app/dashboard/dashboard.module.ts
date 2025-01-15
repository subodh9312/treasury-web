import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    NavHeaderComponent,
    OverviewComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatIconModule,
    
  ]
})
export class DashboardModule { }
