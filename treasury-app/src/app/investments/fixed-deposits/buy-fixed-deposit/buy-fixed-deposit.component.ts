import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { InvestmentType } from '../../../enums/investment-type.enum';
import { Account } from '../../../models/account.model';
import { Company } from '../../../models/company.model';
import { CounterParty } from '../../../models/counterparty.model';
import { FixedDepositInvestment } from '../../../models/fixed-deposit.model';
import { Investment } from '../../../models/investment.model';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { AccountService } from '../../../services/account.service';
import { CompanyService } from '../../../services/company.service';
import { CounterPartyService } from '../../../services/counterparty.service';
import { EnumService } from '../../../services/enum.service';
import { TransactionService } from '../../../services/transactions.service';
import { notZero } from '../../../util/form.validators';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-buy-fixed-deposit',
  templateUrl: './buy-fixed-deposit.component.html',
  styleUrls: ['./buy-fixed-deposit.component.css']
})
export class BuyFixedDepositComponent implements OnInit {

  buyFixedDeposit: FormGroup;
  fixedDepositInvestment;

  @Input() workflowPendingFixedDepositInvestment;
  @Output() transactionUpdated = new EventEmitter();

  isEdit: boolean = false;
  errorMessage: any = null;
  isLoading: boolean = false;
  counterParties: CounterParty[];
  companies: Company[];
  countries: [];
  holdingIntentions: [];
  accounts: Account[] = [];
  conventionalDays: [];
  compoundingTypes: [];

  constructor (private fb: FormBuilder,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private enumService: EnumService,
    private companyService: CompanyService,
    private counterPartyService: CounterPartyService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.counterPartyService.getEnabledCounterParties(InvestmentType.FIXED_DEPOSITS).subscribe(response => {
      this.counterParties = response;
    });

    this.enumService.getCountries().subscribe(response => {
      this.countries = response;
    });

    this.enumService.getHoldingIntentions().subscribe(response => {
      this.holdingIntentions = response;
    });

    this.enumService.getCompoundingTypes().subscribe(response => {
      this.compoundingTypes = response;
    });

    this.enumService.getConventionalDays().subscribe(response => {
      this.conventionalDays = response;
    });

    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.companies = response.content;
    });

    if (this.workflowPendingFixedDepositInvestment == null) {
      this.initializeFixedDepositForm();
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.fixedDepositInvestment = this.workflowPendingFixedDepositInvestment.pendingObject;
    }

    this.buyFixedDeposit = this.fb.group({
      company: [this.fixedDepositInvestment.company, Validators.required],
      fdrNumber: [this.fixedDepositInvestment.fdrNumber, Validators.nullValidator],
      transactionAmount: [this.fixedDepositInvestment.transaction.transactionAmount, Validators.required],
      debitAccount: [{value:this.fixedDepositInvestment.transaction.debitAccount,disabled:true}, Validators.required],
      valueDate: [this.fixedDepositInvestment.transaction.valueDate, Validators.required],
      endDate: [this.fixedDepositInvestment.transaction.endDate, Validators.required],
      holdingIntention: [this.fixedDepositInvestment.transaction.holdingIntention, Validators.required],
      countryOfInvestment: [this.fixedDepositInvestment.transaction.countryOfInvestment, Validators.required],
      leinMarked: [false, Validators.required],
      leinMarkedAmount: [{ value: this.fixedDepositInvestment.leinMarked, disabled: true }, Validators.required],
      leinMarkedUtilization: [{ value: false, disabled: true }, Validators.required],
      //leinMarkedUtilizationAmount: [{ value: this.fixedDepositInvestment.leinMarkedUtilitzationAmount, disabled: true }, Validators.required],
      counterParty: [this.fixedDepositInvestment.counterParty, Validators.required],
      interestRate: [this.fixedDepositInvestment.interestRate, [Validators.required, Validators.min(0), Validators.max(100)]],
      conventionalDays: [this.fixedDepositInvestment.conventionalDays, Validators.required],
      compoundingType: [this.fixedDepositInvestment.compoundingType, Validators.required],
      interestCalculationFactor: [{value:this.fixedDepositInvestment.interestCalculationFactor,disabled:true}, [Validators.min(0)]],
      callable: [false],
      floating: [false]
    }, { validators: [notZero("interestRate")] });

    if (this.isEdit) {
      this.buyFixedDeposit.controls.scheme.enable();
      if (this.fixedDepositInvestment.leinMarkedAmount != null && this.fixedDepositInvestment.leinMarkedAmount != 0) {
        this.buyFixedDeposit.patchValue({ leinMarked: true });
        this.onLeinMarkedSelection({ value: 'true' });
      }
      if (this.fixedDepositInvestment.leinMarkedUtilitzationAmount != null && this.fixedDepositInvestment.leinMarkedUtilitzationAmount !== 0) {
        this.fixedDepositInvestment.patchValue({ leinMarkedUtilization: true });
        this.onLeinMarkedUtilizationSelection({ value: 'true' });
      }
    }
  }

  compareObjects(object1: any, object2: any) {
    let key = "name";
    if (object1.accountNumber != undefined) {
      key = "accountNumber";
    }
    return object1 && object2 && object1[key] == object2[key];
  }

  get f() { return this.buyFixedDeposit.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();

    const fixedDepositInvesment: FixedDepositInvestment = {
      investmentId: null,
      transaction: {
        transactionAmount: form.value.transactionAmount,
        transactionSide: 'BUY',
        quantity: null,
        transactionDate: this.convertDateToString(new Date()),
        valueDate: this.convertDateToString(new Date(form.value.valueDate)),
        debitAccount: form.value.debitAccount,
        updatedTime: null,
        transactionStatus: null,
        holdingIntention: form.value.holdingIntention,
        countryOfInvestment: form.value.countryOfInvestment,
        portfolio: null,
        nextValueDate: null,
        endDate: this.convertDateToString(new Date(form.value.endDate)),
        transactionFrequency: null
      },
      company: form.value.company,
      fdrNumber: form.value.fdrNumber,
      leinMarkedAmount: form.value.leinMarkedAmount,
      leinMarkedUtilitzationAmount: form.value.leinMarkedUtilitzationAmount,
      counterParty: form.value.counterParty,
      interestRate: form.value.interestRate,
      interestRates:null,
      conventionalDays: form.value.conventionalDays,
      compoundingType: form.value.compoundingType,
      interestCalculationFactor: form.value.interestCalculationFactor,
      callable: form.value.callable,
      floating: form.value.floating,
      preClosureDate: null,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      version: null,
      taxDetails: null
    };

    if (!this.isEdit) {
      this.transactionService.addFixedDepositInvestment(fixedDepositInvesment)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.transactionUpdated.emit(res);
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    } else {
      const workflowActionRequest: WorkflowActionRequest<Investment> = {
        workflowPendingTask: {
          taskId: this.workflowPendingFixedDepositInvestment.taksId,
          processInstanceId: this.workflowPendingFixedDepositInvestment.processInstanceId,
          pendingObject: fixedDepositInvesment,
          permittedActions: this.workflowPendingFixedDepositInvestment.permittedActions,
          comment: this.workflowPendingFixedDepositInvestment.comment
        },
        workflowAction: "RESUBMIT"
      };
      this.transactionService.actionFixedDepositTransaction(workflowActionRequest)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.transactionUpdated.emit(res);
        }, err => {
          this.errorMessage = err.error.errorMessages;
        });
    }

    formGroupDirective.resetForm();
    form.reset();
  }
  onCompoundingTypeChange(event){
    
    if (event.value === 'NUMBER_OF_DAYS'||event.value === 'NUMBER_OF_MONTHS')
      this.f.interestCalculationFactor.enable();
    else
    this.f.interestCalculationFactor.disable();   
    
  }

  onLeinMarkedSelection(event) {
    if (event.value === 'true') {
      this.f.leinMarkedUtilization.enable();
    } else {
      this.f.leinMarkedUtilization.disable();
    }
  }

  onLeinMarkedUtilizationSelection(event) {
    if (event.value === 'true') {
      this.f.leinMarkedAmount.enable();
    } else {
      this.f.leinMarkedAmount.disable();    
    }
  }
  onCompanySelected(event){    
    this.companyService.getCompanyAccounts(event.companyId).subscribe(res => {
      this.accounts = res;
      this.f.debitAccount.enable();
    });
  }

  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

  initializeFixedDepositForm(): void {
    this.fixedDepositInvestment = {
      company: null,
      transaction: {
        transactionAmount: null,
        debitAccount: null,
        valueDate: null,
        holdingIntention: null,
        countryOfInvestment: null,
        transactionSide: null,
        transactionDate: null,
        endDate: null
      },
      fdrNumber: null,
      counterParty: null,
      exitLoadPercentage: 0,
      interestRate: 0,
      conventionalDays: null,
      compoundingType: null,
      interestCalculationFactor: 0,
      callable: null,
      leinMarkedAmount: 0,
      leinMarkedUtilizationAmount: 0
    };
  }
}
