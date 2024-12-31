import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { onMainScreen } from '../animations/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [onMainScreen]
})
export class HomeComponent implements OnInit, OnDestroy {

  isUserAuthenticated: boolean = false;
  private authStatusSubscription: Subscription;

  constructor(private authService: AuthService) { }

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
