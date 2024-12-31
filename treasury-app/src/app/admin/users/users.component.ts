import { Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {

  isAdd = false;
  selectedTabIndex = 0;
  userUpdated: any;
  @Output() userEvent: any = new EventEmitter;

  @Input() authorityUpdated: any;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  constructor () { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.selectedTabIndex = this.tabGroup.selectedIndex;
  }

  onAdd() {
    this.isAdd = true;
  }

  onBack(event) {
    if (event != null) {
      this.selectedTabIndex = 1;
      this.onUserUpdated(event);
    }
    this.isAdd = false;
  }

  onTabSelectionChange(event) {
    this.selectedTabIndex = event.index;
  }

  onUserUpdated(user) {
    this.userUpdated = user;
    this.selectedTabIndex = 1;
    this.userEvent.emit(user);
  }

}
