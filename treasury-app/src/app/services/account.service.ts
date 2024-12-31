import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';
import { WorkflowActionRequest } from '../models/workflow-action-request.model';
import { WorkflowPendingTask } from '../models/workflow-pending-task.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.baseUrl;

  constructor (private http: HttpClient) { }

  addAccount(account: Account) {
    return this.http.post<Account>(this.baseUrl + "/accounts/add", account);
  }

  getAllAccounts(page, size) {
    return this.http.get<{ content: Account[], totalElements: number; }>(this.baseUrl + "/accounts/", {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  getAllPendingAccounts(page, size) {
    return this.http.get<{ content: WorkflowPendingTask<Account>[], totalElements: number; }>(this.baseUrl + "/accounts/pending", {
      params: {
        "page": page,
        "size": size
      }
    });
  }

  actionAccount(workflowActionRequest: WorkflowActionRequest<Account>) {
    return this.http.post(this.baseUrl + "/accounts/actionAccount", workflowActionRequest);
  }

  modifyAccount(account: Account) {
    return this.http.put<Account>(this.baseUrl + "/accounts/modify", account);
  }

  deleteAccount(accountId: number) {
    return this.http.delete(this.baseUrl + "/accounts/remove/" + accountId);
  }
}
