import { Component, ViewChild, ElementRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatAutocomplete, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: 'multi-select',
  template: `
  <div>
    <mat-form-field
      class="example-chip-list"
    >
      <mat-chip-list #chipList>
        <mat-chip
          *ngFor="let value of selectedValues"
          [selectable]="selectable"
          [removable]="removable"
          (removed)="removeValue(value)"
        >
          {{ value }}
          <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
        </mat-chip>
        <input
          [placeholder]="placeholder"
          #valueInput
          [matAutocomplete]="auto"
          [matChipInputFor]="chipList"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          (matChipInputTokenEnd)="addValue($event)"
        />
      </mat-chip-list>
      <mat-autocomplete
        #auto="matAutocomplete"
        (optionSelected)="selectedValue($event)"
      >
        <mat-option
          *ngFor="let option of allOptions"
          [value]="option"
        >
          {{ option }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  </div>
  `,
  styles: [
    `
      div {
        height: fit-content;
        width: 280px;
      }

      mat-form-field {
        width: inherit;
      }
    `
  ]
})
export class MultiSelectComponent implements ICellEditorAngularComp {
  selectable = true;
  removable = true;
  placeholder: string = '';
  allOptions: string[] = [];
  selectedValues: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('valueInput') valueInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  agInit(params) {
    this.allOptions = params.allOptions;
    if (params.data.authorities) {
      this.selectedValues = params.data.authorities.map(authority => authority.context + "_" + authority.permission);
      this.placeholder = "New Authority...";
    }
  }

  getValue() {
    return this.selectedValues;
  }

  isPopup() {
    return true;
  }

  addValue(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our value
    if ((value || '').trim() && !this.selectedValues.includes(value.trim())) {
      this.selectedValues.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeValue(value: string): void {
    this.selectedValues.splice(this.selectedValues.indexOf(value), 1);
  }

  selectedValue(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedValues.includes(event.option.value)) {
      this.selectedValues.push(event.option.viewValue);
    }
    this.valueInput.nativeElement.value = '';
  }

}
