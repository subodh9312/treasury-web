import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counterparty',
  templateUrl: './counterparty.component.html',
  styleUrls: ['./counterparty.component.css']
})
export class CounterpartyComponent implements OnInit {

  isAdd = false;
  counterPartyUpdated: any;

  @Output() counterPartyEvent: any = new EventEmitter;

  constructor () { }

  ngOnInit(): void {
  }

  onAdd() {
    this.isAdd = true;
  }

  onBack() {
    if (event != null) {
      this.onCounterPartyUpdated(event);
    }
    this.isAdd = false;
  }

  onCounterPartyUpdated(event) {
    this.counterPartyUpdated = event;
    this.counterPartyEvent.emit(event);
  }

}
