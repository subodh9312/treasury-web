import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthData } from './auth-data.model';
import { Authority } from '../models/authority.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = environment.baseUrl;

  private authorities: Authority[];
  private token: string;
  private isAuthenticated: boolean = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private authAuthoritiesListener = new Subject<Authority[]>();

  constructor (private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getRoles() {
    return this.authorities;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthRolesListener() {
    return this.authAuthoritiesListener.asObservable();
  }

  login(username: string, password: string, error: CallableFunction) {
    const authData: AuthData = { username: username, password: password };
    this.http.post<{ token: string, expiresInDuration: number; }>(this.baseUrl + "/auth/login", authData)
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const expiresInDuration = response.expiresInDuration;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(this.token, expirationDate);
          this.getAuthRoles().subscribe(res => {
            this.authorities = res;
            this.authAuthoritiesListener.next(this.authorities);
            error(null);
          });
        }
      }, err => {
        error(err.error);
      });
  }

  getAuthUsername() {
    return this.http.get(this.baseUrl + "/auth/username", { responseType: 'text' });
  }

  getAuthRoles() {
    return this.http.get<Authority[]>(this.baseUrl + "/auth/authorities");
  }

  checkRoles(userRoles: string[], allowedRoles: string[]): boolean {
    for (let userRole of userRoles) {
      if (allowedRoles.includes(userRole)) {
        return true;
      }
    }
    this.router.navigate(['/']);
    return false;
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.getAuthRoles().subscribe(res => {
        this.authorities = res;
        this.authAuthoritiesListener.next(this.authorities);
        this.authStatusListener.next(true);
      });
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
}
