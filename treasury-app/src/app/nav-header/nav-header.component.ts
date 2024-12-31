import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import {NavService} from '../nav.service';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit, OnDestroy {

  isUserAuthenticated: boolean = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router,public navService: NavService) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isUserAuthenticated = authStatus;
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.authStatusSubscription.unsubscribe();
  }

}
