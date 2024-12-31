import { Component, OnInit } from '@angular/core';
import { onExpanded, onMainContentChange } from '../animations/animations';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css'],
  animations: [onExpanded, onMainContentChange]
})
export class InvestmentsComponent implements OnInit {

  expanded = true;

  activeTab: string = '';
  activeComponent: string = '';

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

  reset() {
    this.activeTab = '';
    this.activeComponent = '';
  }

}
