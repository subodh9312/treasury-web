import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MutualFundInvestmentMethod } from '../../../enums/mf-investment-method.enum';
import { Account } from '../../../models/account.model';
import { Company } from '../../../models/company.model';
import { Investment } from '../../../models/investment.model';
import { MutualFundInvestment } from '../../../models/mutual-fund.model';
import { NAV } from '../../../models/nav.model';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { AccountService } from '../../../services/account.service';
import { CompanyService } from '../../../services/company.service';
import { EnumService } from '../../../services/enum.service';
import { TransactionFrequency } from '../../../enums/transaction-frequency.enum';
import { notZero } from '../../../util/form.validators';
import { TransactionService } from '../../../services/transactions.service';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-buy-mutual-fund',
  templateUrl: './buy-mutual-fund.component.html',
  styleUrls: ['./buy-mutual-fund.component.css']
})
export class BuyMutualFundComponent implements OnInit {

  buyMutualFund: FormGroup;
  mutualFundInvestment;

  @Input() workflowPendingMutualFundInvestment;
  @Input() isSIP: boolean;
  @Output() transactionUpdated = new EventEmitter();

  isEdit: boolean = false;
  errorMessage: any = null;
  isLoading = false;
  fundFamilies = [];
  schemesForFundFamily: NAV[] = [];
  schemeTypes = [];
  countries = [];
  companies: Company[];
  accounts: Account[] = [];
  holdingIntentions: [];
  transactionFrequencies: [];

  constructor (
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private accountService: AccountService,
    private companyService: CompanyService,
    private enumService: EnumService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.companies = res.content;
    });
    this.enumService.getSchemeTypes().subscribe(res => {
      this.schemeTypes = res;
    });
    this.enumService.getHoldingIntentions().subscribe(res => {
      this.holdingIntentions = res;
    });
    this.transactionService.getAllFundFamilies().subscribe(res => {
      this.fundFamilies = res;
    });
    
    this.enumService.getCountries().subscribe(res => {
      this.countries = res;
    });
    this.enumService.getTransactionFrequencies().subscribe(res => {
      this.transactionFrequencies = res;
    });

    if (this.workflowPendingMutualFundInvestment == null) {
      this.initializeMutualFundForm();
      this.isEdit = false;
    } else {
      this.isEdit = true;
      this.mutualFundInvestment = this.workflowPendingMutualFundInvestment.pendingObject;
    }

    this.buyMutualFund = this.fb.group({
      company: [this.mutualFundInvestment.company, Validators.required],
      fundFamily: [this.mutualFundInvestment.netAssetValue.fundFamily, Validators.required],
      scheme: [{ value: this.mutualFundInvestment.netAssetValue, disabled: true }, Validators.required],
      schemeType: [this.mutualFundInvestment.schemeType, Validators.required],
      transactionAmount: [this.mutualFundInvestment.transaction.transactionAmount, Validators.required],
      debitAccount: [{value:this.mutualFundInvestment.transaction.debitAccount,disabled:true}, Validators.required],
      valueDate: [this.mutualFundInvestment.transaction.valueDate, Validators.required],
      holdingIntention: [this.mutualFundInvestment.transaction.holdingIntention, Validators.required],
      countryOfInvestment: [this.mutualFundInvestment.transaction.countryOfInvestment, Validators.required],
      exitLoad: [false, Validators.required],
      exitLoadPercentage: [{ value: this.mutualFundInvestment.exitLoadPercentage, disabled: true }, Validators.required],
      exitLoadApplicableMinimumDuration: [{ value: this.mutualFundInvestment.exitLoadApplicableMinimumDuration, disabled: true }, Validators.required],
      leinMarked: [false, Validators.required],
      leinMarkedAmount: [{ value: this.mutualFundInvestment.leinMarkedAmount, disabled: true }, Validators.required],
      leinMarkedUtilization: [{ value: false, disabled: true }, Validators.required],
      leinMarkedUtilizationAmount: [{ value: this.mutualFundInvestment.leinMarkedUtilitzationAmount, disabled: true }, Validators.required],
      transactionFrequency: [{ value: null }, Validators.required],
      periodOfInvestment: [{ value: 0 }, Validators.required]
    }, { validators: [notZero("periodOfInvestment")] });

    if (this.isEdit) {
      this.transactionService.getAllNavsByFundFamily(this.mutualFundInvestment.netAssetValue.fundFamily).subscribe(res => {
        this.schemesForFundFamily = res;
        this.buyMutualFund.controls.scheme.enable();
      });
      if (this.mutualFundInvestment.exitLoadPercentage != null && this.mutualFundInvestment.exitLoadPercentage !== 0) {
        this.buyMutualFund.patchValue({ exitLoad: true });
        this.onExitLoadSelection({ value: 'true' });
      }
      if (this.mutualFundInvestment.leinMarkedAmount != null && this.mutualFundInvestment.leinMarkedAmount !== 0) {
        this.buyMutualFund.patchValue({ leinMarked: true });
        this.onLeinMarkedSelection({ value: 'true' });
      }
      if (this.mutualFundInvestment.leinMarkedUtilitzationAmount != null && this.mutualFundInvestment.leinMarkedUtilitzationAmount !== 0) {
        this.buyMutualFund.patchValue({ leinMarkedUtilization: true });
        this.onLeinMarkedUtilizationSelection({ value: 'true' });
      }
    }
  }

  compareObjects(object1: any, object2: any) {
    let key = "name";
    if (object1.schemeName != undefined) {
      key = "schemeName";
    } else if (object1.accountNumber != undefined) {
      key = "accountNumber";
    }
    return object1 && object2 && object1[key] == object2[key];
  }

  get f() { return this.buyMutualFund.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    let mutualFundInvestmentMethod = MutualFundInvestmentMethod.LUMP_SUM_INVESTMENT.valueOf();
    let transactionFrequency = TransactionFrequency.NONE.valueOf();
    let periodOfInvestment = 0;
    if (this.isSIP) {
      mutualFundInvestmentMethod = MutualFundInvestmentMethod.SYSTEMATIC_INVESTMENT_PLAN.valueOf();
      transactionFrequency = form.value.transactionFrequency;
      periodOfInvestment = form.value.periodOfInvestment;
    }
    this.isLoading = true;
    this.spinner.show();
    const mutualFundInvestment: MutualFundInvestment = {
      investmentId: null,
      netAssetValue: form.value.scheme,
      schemeType: form.value.schemeType,
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
        transactionFrequency: transactionFrequency,
        nextValueDate: null,
        endDate: null
      },
      company: form.value.company,
      transactionNav: null,
      exitLoadPercentage: form.value.exitLoadPercentage,
      exitLoadApplicableMinimumDuration: form.value.exitLoadApplicableMinimumDuration,
      leinMarkedAmount: form.value.leinMarkedAmount,
      leinMarkedUtilitzationAmount: form.value.leinMarkedUtilizationAmount,
      mutualFundInvestmentMethod: mutualFundInvestmentMethod,
      periodOfInvestment: periodOfInvestment,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      version: null,
      taxDetails: null,
    };
    if (!this.isEdit) {
      this.transactionService.addMutualFundInvestment(mutualFundInvestment)
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
          taskId: this.workflowPendingMutualFundInvestment.taskId,
          processInstanceId: this.workflowPendingMutualFundInvestment.processInstanceId,
          pendingObject: mutualFundInvestment,
          permittedActions: this.workflowPendingMutualFundInvestment.permittedActions,
          comment: this.workflowPendingMutualFundInvestment.comment
        },
        workflowAction: "RESUBMIT"
      };
      this.transactionService.actionMutualFundTransaction(workflowActionRequest)
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

  onFundFamilySelected(event) {
    this.transactionService.getAllNavsByFundFamily(event.trim()).subscribe(res => {
      this.schemesForFundFamily = res;
      this.f.scheme.enable();
    });
  }
  onCompanySelected(event){    
    this.companyService.getCompanyAccounts(event.companyId).subscribe(res => {
      this.accounts = res;
      this.f.debitAccount.enable();
    });
  }
  
  onExitLoadSelection(event) {
    if (event.value === 'true') {
      this.f.exitLoadPercentage.enable();
      this.f.exitLoadApplicableMinimumDuration.enable();
    } else {
      this.f.exitLoadPercentage.disable();
      this.f.exitLoadApplicableMinimumDuration.disable();
    }
  }

  onLeinMarkedSelection(event) {
    if (event.value === 'true') {
      this.f.leinMarkedAmount.enable();
      this.f.leinMarkedUtilization.enable();
    } else {
      this.f.leinMarkedAmount.disable();
      this.f.leinMarkedUtilization.disable();
    }
  }

  onLeinMarkedUtilizationSelection(event) {
    if (event.value === 'true') {
      this.f.leinMarkedUtilizationAmount.enable();
    } else {
      this.f.leinMarkedUtilizationAmount.disable();
    }
  }

  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

  initializeMutualFundForm() {
    this.mutualFundInvestment = {
      company: null,
      netAssetValue: {
        fundFamily: null
      },
      schemeType: null,
      transaction: {
        transactionAmount: 0,
        debitAccount: null,
        valueDate: null,
        holdingIntention: null,
        countryOfInvestment: null,
      },
      exitLoadPercentage: 0,
      leinMarkedAmount: 0,
      leinMarkedUtilitzationAmount: 0
    };
  }
}
