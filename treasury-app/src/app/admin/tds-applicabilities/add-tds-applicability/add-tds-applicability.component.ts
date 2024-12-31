import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TdsApplicability } from './../../../models/tds-applicability.model';
import { TdsService } from '../../../services/tds.service';
import { notZero } from 'src/app/util/form.validators';
import { InvestmentType } from 'src/app/enums/investment-type.enum';
import { EnumService } from 'src/app/services/enum.service';
import { CounterParty } from 'src/app/models/counterparty.model';
import { CounterPartyService } from 'src/app/services/counterparty.service';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-add-tds-applicability',
  templateUrl: './add-tds-applicability.component.html',
  styleUrls: ['./add-tds-applicability.component.css']
})
export class AddTdsApplicabilityComponent implements OnInit, OnChanges {

  addTdsForm: FormGroup;
  errorMessage: any = null;
  isLoading: boolean = false;
  tds: TdsApplicability[];
  investmentTypes: InvestmentType[];
  counterParties: CounterParty[];
  companies: Company[];

  @Output() tdsCreated = new EventEmitter();

  constructor (
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private tdsService: TdsService,
    private enumService: EnumService,
    private counterPartyService: CounterPartyService,
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {

    this.enumService.getInvestmentTypes().subscribe(response => {
      this.investmentTypes = response;
    });

    this.counterPartyService.getAllCounterParties(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.counterParties = response.content;
    });

    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.companies = response.content;
    });

    this.tdsService.getAllTdsApplicabilities(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.tds = response.content;
    });

    this.addTdsForm = this.fb.group({
      investmentType: [null, [Validators.required]],
      effectiveDate: [null, [Validators.required]],
      tdsPercent: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      minimumTransactionAmount: [null, [Validators.required, Validators.min(0)]],
      counterParty: [null],
      company: [null]
    }, { validators: [notZero("tdsPercent")] });
  }

  ngOnChanges(): void {
    this.tdsService.getAllTdsApplicabilities(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.tds = response.content;
    });
  }

  get f() { return this.addTdsForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();

    const tdsApplicability: TdsApplicability = {
      tdsApplicabilityId: null,
      tdsPercent: form.value.tdsPercent,
      investmentType: form.value.investmentType,
      minimumTransactionAmount: form.value.minimumTransactionAmount,
      effectiveDate: this.convertDateToString(new Date(form.value.effectiveDate)),
      counterParty: form.value.counterParty,
      company: form.value.company
    };

    this.tdsService.addTdsApplicability(tdsApplicability).subscribe(response => {
      this.isLoading = false;
      this.spinner.hide();
      this.tdsCreated.emit(response);
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = error.error.errorMessages;
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
