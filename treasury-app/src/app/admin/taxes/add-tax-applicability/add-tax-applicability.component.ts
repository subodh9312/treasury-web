import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Tax } from '../../../models/tax.model';
import { TaxApplicability } from '../../../models/tax.applicability.model';
import { TaxService } from '../../../services/tax.service';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { EnumService } from '../../../services/enum.service';
import { Constants } from '../../../util/constants.component';


@Component({
  selector: 'app-add-tax-applicability',
  templateUrl: './add-tax-applicability.component.html',
  styleUrls: ['./add-tax-applicability.component.css']
})
export class AddTaxApplicabilityComponent implements OnInit, OnChanges {

  addTaxApplicabilityForm: FormGroup;
  errorMessage: any = null;
  isLoading: boolean = false;
  taxes: Tax[];
  investmentTypes: InvestmentType[];
  transactionSides: [];

  @Output() taxApplicabilityCreated = new EventEmitter();

  constructor (
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private taxService: TaxService,
    private enumService: EnumService) { }

  ngOnInit(): void {
    this.taxService.getAllTaxes(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.taxes = response.content;
    });

    this.enumService.getInvestmentTypes().subscribe(response => {
      this.investmentTypes = response;
    });

    this.enumService.getTransactionSides().subscribe(response => {
      this.transactionSides = response;
    });

    this.addTaxApplicabilityForm = this.fb.group({
      tax: [null, [Validators.required]],
      investmentType: [null, [Validators.required]],
      transactionSidesApplicable: [[], Validators.required],
      effectiveDate: [null, Validators.required],
      taxPercent: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.taxService.getAllTaxes(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.taxes = response.content;
    });
  }

  get f() { return this.addTaxApplicabilityForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();

    const taxApplicability: TaxApplicability = {
      taxApplicabilityId: null,
      investmentType: form.value.investmentType,
      transactionSidesApplicable: form.value.transactionSidesApplicable,
      effectiveDate: this.convertDateToString(new Date(form.value.effectiveDate)),
      tax: form.value.tax,
      taxPercent: form.value.taxPercent
    };

    this.taxService.addTaxApplicability(taxApplicability).subscribe(response => {
      this.isLoading = false;
      this.spinner.hide();
      this.taxApplicabilityCreated.emit(response);
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = error.error.errorMessage;
    });
    formGroupDirective.resetForm();
    form.reset();
  }

  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

}
