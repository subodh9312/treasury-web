import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Person } from '../models/person.model';
import { PasswordReset } from '../models/password-reset.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  modifyPerson(userDetails: Person) {
    return this.http.put(this.baseUrl + "/persons/modify", userDetails);
  }

  changePassword(passwordResetForm: PasswordReset) {
    return this.http.put(this.baseUrl + "/users/changePassword", passwordResetForm);
  }

  getUserByUsername(username: string) {
    return this.http.get<User>(this.baseUrl + "/users/details/" + username);
  }
}
