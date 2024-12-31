import { Component } from '@angular/core';
import { ICellRendererAngularComp, ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'checkbox-renderer',
  template: `
    <input
      style="margin-left: 15px;"
      type="checkbox"
      (click)="checkedHandler($event)"
      [checked]="checked"
      [disabled]="disabled"
    />
`,
})
export class CheckboxComponent implements ICellRendererAngularComp, ICellEditorAngularComp {
  disabled = true;
  checked: any

  agInit(params: any): void {
    this.checked = params.value;
    if (params.api.getEditingCells().length > 0) {
      this.disabled = false;
    }
  }

  refresh() {
    return true;
  }

  getValue() {
    return this.checked;
  }

  checkedHandler(event) {
    this.checked = event.target.checked;
  }
}
