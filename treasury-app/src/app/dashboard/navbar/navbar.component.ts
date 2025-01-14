import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav'; 

@Component({
  selector: 'app-navbar',
  // imports: [ MatCardModule, CommonModule ,  MatSidenavModule ,MatListModule,MatIconModule,
  //   RouterModule,HeaderComponent
  // ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

 constructor(private router: Router){}
 InvestmentMenu= [
    {
      label: 'New Investment',
      icon: 'dashboard',
      expanded: false,
      children: [
        { label: 'Mutual Fund', route: '/mutualFund' },
        { label: 'Fixed Deposit', route: '/fixedDeposit' },
      ],
    },
    {
      label: 'Redemption',
      icon: 'settings',
      
      children: [
        { label: 'Profile', route: ' ' },
        { label: 'Preferences', route: ' ' },
      ],
    },
    {
      label: 'Borrowing',
      icon: 'help',
      expanded: false,
      children: [
        { label: 'FAQ', route: '' },
        { label: 'Support', route: '' },
      ],
    },
    {
      label: 'Recent Transaction',
      icon: 'help',
      expanded: false,
      children: [
        { label: 'FAQ', route: '' },
        { label: 'Support', route: '' },
      ],
    },{
      label: 'Mark/Unmark Lien',
      icon: 'help',
      expanded: false,
      children: [
        { label: 'FAQ', route: '' },
        { label: 'Support', route: '' },
      ],
    },
 ];

 toggleDropdown(item: any): void {
  this.InvestmentMenu.forEach(menuItem => {
    if (menuItem !== item) {
      menuItem.expanded = false;
    }
  });
  if (item.children) {
    item.expanded = !item.expanded;
  }
}
}
