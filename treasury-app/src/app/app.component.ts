import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { NavItem } from './nav-item';
import {NavService} from './nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild('appDrawer') appDrawer: ElementRef;
  isUserAuthenticated: boolean = false;
  private authStatusSubscription: Subscription;

  navItems:NavItem[] =  [
    {
      displayName: 'Investments',
      iconName: 'attach_money',
      route: 'investments',
      children: [
        {
          displayName: 'Mutual Funds',
          iconName: '',
          route: 'mutualfunds',
        },
        {
          displayName: 'Fixed Deposits',
          iconName: '',
          route: 'fixeddeposits',
        }
      ]
    },
    {
      displayName: 'Borrowings',
      iconName: 'account_balance_wallet',
      route: '',
      children: [
        {
          displayName: 'Loans Master',
          iconName: '',
          route: 'loanavailed',
        }
      ]
    },
    {
      displayName: 'Masters',
      iconName: 'account_balance',
      route: 'admin',
      children: [
        {
          displayName: 'Company',
          iconName: '',
          route: 'companies',
        },
        {
          displayName: 'Bank Accounts',
          iconName: '',
          route: 'accounts',
        },
        {
          displayName: 'Counterparty',
          iconName: '',
          route: 'counterparty',
        },
        {
          displayName: 'Taxation',
          iconName: '',
          route: 'taxation',
        },
        {
          displayName: 'Tax Deducted At Source',
          iconName: '',
          route: 'tds',
        }
      ]
    },
    {
      displayName: 'Role Management',
      iconName: 'supervised_user_circle',
      route: 'admin',
      children: [
        {
          displayName: 'Users',
          iconName: '',
          route: 'users',
        },
        {
          displayName: 'Authorities',
          iconName: '',
          route: 'authorities',
        }

      ]
    }

  ]

  constructor(private authService: AuthService, private router: Router,private navService: NavService) { }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
  ngOnInit() {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isUserAuthenticated = authStatus;
    });
    this.authService.autoAuthUser();
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }
}
