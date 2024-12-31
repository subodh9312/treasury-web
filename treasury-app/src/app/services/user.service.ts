import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { WorkflowActionRequest } from '../models/workflow-action-request.model';
import { WorkflowPendingTask } from '../models/workflow-pending-task.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  addUser(user: User) {
    return this.http.post<User>(this.baseUrl + "/users/addUser", user);
  }

  modifyUser(user: User) {
    return this.http.put(this.baseUrl + "/users/modifyUser", user);
  }

  deleteUser(username: string) {
    return this.http.delete(this.baseUrl + "/users/remove/" + username);
  }

  getAllUsers(page, size) {
    return this.http.get<{ content: User[], totalElements: number; }>(this.baseUrl + "/users/", {
      params: { "page": page, "size": size }
    });
  }

  getAllPendingUsers(page, size) {
    return this.http.get<{ content: WorkflowPendingTask<User>[], totalElements: number; }>(this.baseUrl + "/users/pending", {
      params: { "page": page, "size": size }
    });
  }

  actionUser(workflowActionRequest: WorkflowActionRequest<User>) {
    return this.http.post(this.baseUrl + "/users/actionUser", workflowActionRequest);
  }
}
