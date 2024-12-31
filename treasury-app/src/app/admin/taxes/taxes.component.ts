import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit {

  isAdd = false;
  isApplicabilityAdd = false;
  taxUpdated: any;

  @Output() taxEvent: any = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
  }

  onAdd() {
    this.isAdd = true;
    this.isApplicabilityAdd = false;
  }

  onTaxApplicability() {
    this.isApplicabilityAdd = true;
    this.isAdd = false;
  }

  onBack() {
    if (event != null) {
      this.onTaxUpdated(event);
    }
    this.isAdd = false;
    this.isApplicabilityAdd = false;
  }

  onTaxUpdated(event: any) {
    this.taxUpdated = event;
    this.taxEvent.emit(event);
  }

}
