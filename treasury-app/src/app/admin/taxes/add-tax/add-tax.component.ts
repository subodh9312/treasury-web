import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tax } from '../../../models/tax.model';
import { TaxService } from '../../../services/tax.service';
import { notBlank } from '../../../util/form.validators';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.css']
})
export class AddTaxComponent implements OnInit, OnChanges {

  addTaxForm: FormGroup;
  errorMessage: any = null;
  isLoading: boolean = false;
  taxes: Tax[];

  @Output() taxCreated = new EventEmitter();

  constructor (
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private taxService: TaxService) { }

  ngOnInit(): void {
    this.taxService.getAllTaxes(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.taxes = response.content;
    });

    this.addTaxForm = this.fb.group({
      taxName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      description: [null, [Validators.minLength(3), Validators.maxLength(200)]]
    }, { validators: [notBlank('taxName')] });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.taxService.getAllTaxes(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.taxes = response.content;
    });
  }

  get f() { return this.addTaxForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const tax: Tax = {
      taxId: null,
      taxName: form.value.taxName,
      description: form.value.description
    };

    this.taxService.addTax(tax).subscribe(response => {
      this.isLoading = false;
      this.spinner.hide();
      this.taxCreated.emit(response);
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = error.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }
}
