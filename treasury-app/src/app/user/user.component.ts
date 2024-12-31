import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: User;
  username: string;
  activeTab: string = '';
  profileTab = 'profile';
  passwordTab = 'password';

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.authService.getAuthUsername().subscribe(username => {
      this.username = username;
      this.userService.getUserByUsername(this.username).subscribe(res => {
        this.user = res;
        this.setActiveTab(this.profileTab);
      });
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onUserUpdated() {
    this.userService.getUserByUsername(this.username).subscribe(res => {
      this.user = res;
    });
  }

}
