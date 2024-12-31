import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getAllPersons() {
    return this.http.get<{ content: Person[] }>(this.baseUrl + "/persons/");
  }

  addPerson(person: Person) {
    return this.http.post<Person>(this.baseUrl + "/persons/add", person);
  }
}
