import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  isAdd = false;
  companyUpdated: any;

  @Input() personUpdated: any;
  @Input() userUpdated: any;

  @Output() companyEvent: any = new EventEmitter;
  @Output() personEvent: any = new EventEmitter;

  constructor () { }

  ngOnInit(): void {
  }

  onAdd() {
    this.isAdd = true;
  }

  onBack() {
    if (event != null) {
      this.onCompanyUpdated(event);
    }
    this.isAdd = false;
  }

  onCompanyUpdated(event) {
    this.companyUpdated = event;
    this.companyEvent.emit(event);
  }

  onPersonUpdated(event) {
    this.personUpdated = event;
    this.personEvent.emit(event);
  }
}
