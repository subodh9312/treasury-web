import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, AfterViewInit {

  isAdd = false;
  selectedTabIndex = 0;

  accountUpdated: any;

  @Input() personUpdated: any;
  @Input() userUpdated: any;
  @Input() companyUpdated: any;

  @Output() accountEvent: any = new EventEmitter;
  @Output() personEvent: any = new EventEmitter;

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
      this.onAccountUpdated(event);
    }
    this.isAdd = false;
  }

  onTabSelectionChange(event) {
    this.selectedTabIndex = event.index;
  }

  onAccountUpdated(event) {
    this.accountUpdated = event;
    this.accountEvent.emit(event);
  }

  onPersonUpdated(event) {
    this.personUpdated = event;
    this.personEvent.emit(event);
  }

}
