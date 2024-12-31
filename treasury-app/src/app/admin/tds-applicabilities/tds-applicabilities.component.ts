import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tds-applicabilities',
  templateUrl: './tds-applicabilities.component.html',
  styleUrls: ['./tds-applicabilities.component.css']
})
export class TdsApplicabilitiesComponent implements OnInit {

  isAdd = false;
  tdsUpdated: any;

  @Output() tdsEvent: any = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onAdd() {
    this.isAdd = true;
  }
  
  onBack() {
    if (event != null) {
      this.onTdsUpdated(event);
    }
    this.isAdd = false;
  }

  onTdsUpdated(event: any) {
    this.tdsUpdated = event;
    this.tdsEvent.emit(event);
  }
}
