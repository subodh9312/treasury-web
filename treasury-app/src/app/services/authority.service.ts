import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Authority } from '../models/authority.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  addAuthority(authority) {
    return this.http.post<Authority>(this.baseUrl + "/authorities/add", authority);
  }

  removeAuthority(authorityId: number) {
    return this.http.delete(this.baseUrl + "/authorities/remove/" + authorityId);
  }

  getAllAuthorities(page, size) {
    return this.http.get<{ content: Authority[], totalElements: number; }>(this.baseUrl + "/authorities/", {
      params: {
        "page": page,
        "size": size
      }
    });
  }
}
