import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InvestmentType } from 'src/app/enums/investment-type.enum';
import { CounterParty } from '../../../models/counterparty.model';
import { CounterPartyService } from '../../../services/counterparty.service';
import { EnumService } from '../../../services/enum.service';
import { notBlank } from '../../../util/form.validators';
import { Constants } from '../../../util/constants.component';


@Component({
  selector: 'app-add-counterparty',
  templateUrl: './add-counterparty.component.html',
  styleUrls: ['./add-counterparty.component.css']
})
export class AddCounterpartyComponent implements OnInit, OnChanges {

  addCounterPartyForm: FormGroup;
  errorMessage: any = null;
  isLoading: boolean = false;
  counterParties: CounterParty[];
  counterPartyClassifications: [];
  creditRatings: [];
  investmentTypes: [];

  @Output() counterPartyCreated = new EventEmitter();

  constructor (
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private enumService: EnumService,
    private counterPartyService: CounterPartyService
  ) { }

  ngOnInit(): void {
    this.counterPartyService.getAllCounterParties(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.counterParties = response.content;
    });
    this.enumService.getCounterPartyClassifications().subscribe(response => {
      this.counterPartyClassifications = response;
    });
    this.enumService.getCreditRatings().subscribe(response => {
      this.creditRatings = response;
    });
    this.enumService.getInvestmentTypes().subscribe(response => {
      this.investmentTypes = response;
    });

    this.addCounterPartyForm = this.fb.group({
      counterPartyName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      counterPartyClassification: [null, [Validators.required, Validators.minLength(3)]],
      creditRating: [null, [Validators.required]],
      enabledInvestmentTypes: [[], Validators.required],
    });
  }

  ngOnChanges(): void {
    this.counterPartyService.getAllCounterParties(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.counterParties = response.content;
    });
  }

  get f() { return this.addCounterPartyForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const counterParty: CounterParty = {
      counterPartyId: null,
      counterPartyName: form.value.counterPartyName,
      counterPartyClassification: form.value.counterPartyClassification,
      creditRating: form.value.creditRating,
      enabledInvestmentTypes: form.value.enabledInvestmentTypes
    };

    this.counterPartyService.addCounterParty(counterParty).subscribe(response => {
      this.isLoading = false;
      this.spinner.hide();
      this.counterPartyCreated.emit(response);
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = error.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }
}
