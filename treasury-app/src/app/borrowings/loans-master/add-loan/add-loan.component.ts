import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Loan } from '../../../models/loan.model';
import { LoansService } from '../../../services/loans.service';
import { Constants } from '../../../util/constants.component';
import { CounterParty } from '../../../models/counterparty.model';
import { CounterPartyService } from '../../../services/counterparty.service';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { EnumService } from '../../../services/enum.service';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { Account } from '../../../models/account.model';
import { TransactionService } from '../../../services/transactions.service';

@Component({
  selector: 'app-add-loan',
  templateUrl: './add-loan.component.html',
  styleUrls: ['./add-loan.component.css']
})
export class AddLoanComponent implements OnInit {

  addLoanForm: FormGroup;
  errorMessage: any = null;
  isLoading: boolean = false;
  loans: Loan[];
  accounts: Account[] = [];
  counterParties: CounterParty[];
  companies: Company[];
  conventionalDays: [];
  compoundingTypes: [];

  @Output() loanCreated = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private loanService: LoansService,
    private counterPartyService: CounterPartyService,
    private enumService: EnumService,
    private companyService: CompanyService,
    private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.counterPartyService.getEnabledCounterParties(InvestmentType.LOAN).subscribe(response => {
      this.counterParties = response;
    });

    this.loanService.getAllLoans(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.loans = response.content;
    });
    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.companies = res.content;
    });

    this.enumService.getConventionalDays().subscribe(response => {
      this.conventionalDays = response;
    });

    this.enumService.getCompoundingTypes().subscribe(response => {
      this.compoundingTypes = response;
    });
    // this.enumService.getCountries().subscribe(res => {
    //   this.countries = res;
    // });

    this.addLoanForm = this.fb.group({
      counterParty: [null, Validators.required],
      company: [null, Validators.required],
      referenceNumber: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      sanctionDate: [null, Validators.required],
      closureDate: [null, Validators.required],
      sanctionAmount: [null, Validators.required],
      borrowing: [true, Validators.required],
      interestRate: [null, Validators.required],
      secured: [true, Validators.required],
      securityDetails: [null, [Validators.required]],
      preClosureAllowed: [false, Validators.required],
      debitAccount: [null, Validators.required],
      conventionalDays: [null, Validators.required],
      compoundingType: [null, Validators.required],
      interestCalculationFactor: [{value: null, disabled:true}, Validators.min(0)]
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loanService.getAllLoans(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.loans = response.content;
    });
  }

  get f() { return this.addLoanForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const loan: Loan = {
      investmentId: null,
      transaction: {
        transactionAmount: form.value.sanctionAmount,
        quantity: null,
        transactionSide: 'BUY',
        debitAccount: form.value.debitAccount,
        holdingIntention: 'NONE',
        transactionStatus: null,
        transactionFrequency: null,
        countryOfInvestment: null,
        updatedTime: null,
        nextValueDate: null,
        valueDate: this.convertDateToString(new Date(form.value.sanctionDate)),
        transactionDate: this.convertDateToString(new Date()),
        endDate: this.convertDateToString(new Date(form.value.closureDate)),
        portfolio: null
      },
      counterParty: form.value.counterParty,
      interestRate: form.value.interestRate,
      interestRates: null,
      conventionalDays: form.value.conventionalDays,
      compoundingType: form.value.compoundingType,
      interestCalculationFactor: form.value.interestCalculationFactor,
      referenceNumber: form.value.referenceNumber,
      borrowing: form.value.borrowing,
      secured: form.value.secured,
      securityDetails: form.value.securityDetails,
      company: form.value.company,
      preClosureAllowed: form.value.preClosureAllowed,
      closed: false,
      currentOutstandingAmount: 0,
      preClosureDate: null,
      taxDetails: [],
      createdBy: '',
      createdDate: '',
      lastModifiedBy: '',
      lastModifiedDate: '',
      version: 0
    };

    this.transactionService.addNewLoan(loan).subscribe(response => {
      this.isLoading = false;
      this.spinner.hide();
      this.loanCreated.emit(response);
    }, error => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = error.error.errorMessages;
    });
  }
  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

  onCompanySelected(event) {
    this.companyService.getCompanyAccounts(event.companyId).subscribe(res => {
      this.accounts = res;
      this.f.debitAccount.enable();
    });
  }

  onCompoundingTypeChange(event){
    
    if (event.value === 'NUMBER_OF_DAYS'||event.value === 'NUMBER_OF_MONTHS') {
      this.f.interestCalculationFactor.enable();
    } else {
      this.f.interestCalculationFactor.disable();
    }
  }

  compareObjects(object1: any, object2: any) {
    let key = "name";
    if (object1.accountNumber != undefined) {
      key = "accountNumber";
    }
    return object1 && object2 && object1[key] == object2[key];
  }

}
