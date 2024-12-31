import { Component, OnInit } from '@angular/core';
import { onMainContentChange, onExpanded } from '../animations/animations';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [onExpanded, onMainContentChange]
})
export class AdminComponent implements OnInit {

  expanded = true;

  activeTab: string = '';
  activeComponent: string = '';
  authorityUpdated: any;
  userUpdated: any;
  companyUpdated: any;
  accountUpdated: any;
  personUpdated: any;

  constructor () { }

  ngOnInit(): void {
  }

  getActiveComponent(): string {
    return this.activeComponent;
  }

  getActiveTab() {
    return this.activeTab;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setActiveComponent(component: string) {
    this.activeComponent = component;
  }

  onRoleUpdated(role) {
    this.authorityUpdated = role;
    this.setActiveComponent('role-list');
  }

  onUserUpdated(user) {
    this.userUpdated = user;
    this.setActiveComponent('pending-users');
  }

  onCompanyUpdated(company) {
    this.companyUpdated = company;
    this.setActiveComponent('company-list');
  }

  onAccountUpdated(account) {
    this.accountUpdated = account;
    this.setActiveComponent('pending-accounts');
  }

  onPersonUpdated(person) {
    this.personUpdated = person;
  }

  reset() {
    this.activeTab = '';
    this.activeComponent = '';
  }
}
