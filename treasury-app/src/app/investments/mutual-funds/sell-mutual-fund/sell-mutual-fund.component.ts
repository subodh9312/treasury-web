import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MutualFundInvestment } from '../../../models/mutual-fund.model';
import { checkQuantity, notZero } from '../../../util/form.validators';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { Investment } from '../../../models/investment.model';
import { MutualFundInvestmentMethod } from '../../../enums/mf-investment-method.enum';
import { TransactionFrequency } from '../../../enums/transaction-frequency.enum';
import { EnumService } from '../../../services/enum.service';
import { TransactionService } from '../../../services/transactions.service';

@Component({
  selector: 'app-sell-mutual-fund',
  templateUrl: './sell-mutual-fund.component.html',
  styleUrls: ['./sell-mutual-fund.component.css']
})
export class SellMutualFundComponent implements OnInit {

  sellMutualFund: FormGroup;
  @Input() isSWP: boolean;
  @Input() workflowPendingMutualFundInvestment;
  @Input() sellMutualFundInvestment;

  @Output() transactionUpdated = new EventEmitter();

  isEdit: boolean = false;
  errorMessage: any = null;
  isLoading = false;
  transactionFrequencies = [];

  constructor (
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private enumService: EnumService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.enumService.getTransactionFrequencies().subscribe(res => {
      this.transactionFrequencies = res;
    });
    if (this.sellMutualFundInvestment) {
      this.isEdit = false;
      this.sellMutualFundInvestment.transaction.transactionAmount = 0;
      this.sellMutualFundInvestment.transaction.quantity = 0;
      this.sellMutualFundInvestment.transaction.valueDate = null;
    } else {
      this.isEdit = true;
      this.sellMutualFundInvestment = this.workflowPendingMutualFundInvestment.pendingObject;
    }

    this.sellMutualFund = this.fb.group({
      company: [{ value: this.sellMutualFundInvestment.company.name, disabled: true }, Validators.required],
      fundFamily: [{ value: this.sellMutualFundInvestment.netAssetValue.fundFamily, disabled: true }, Validators.required],
      scheme: [{ value: this.sellMutualFundInvestment.netAssetValue.schemeName, disabled: true }, Validators.required],
      schemeType: [{ value: this.sellMutualFundInvestment.schemeType, disabled: true }, Validators.required],
      portfolioQuantity: [{ value: this.sellMutualFundInvestment.transaction.portfolio.quantity, disabled: true }, Validators.required],
      transactionType: [true, Validators.required],
      transactionAmount: [this.sellMutualFundInvestment.transaction.transactionAmount, Validators.required],
      transactionQuantity: [{ value: this.sellMutualFundInvestment.transaction.quantity, disabled: true }, Validators.required],
      debitAccount: [{ value: this.sellMutualFundInvestment.transaction.debitAccount.accountNumber + "-" + this.sellMutualFundInvestment.transaction.debitAccount.bankName, disabled: true }, Validators.required],
      valueDate: [this.sellMutualFundInvestment.transaction.valueDate, Validators.required],
      holdingIntention: [{ value: this.sellMutualFundInvestment.transaction.holdingIntention, disabled: true }, Validators.required],
      countryOfInvestment: [{ value: this.sellMutualFundInvestment.transaction.countryOfInvestment, disabled: true }, Validators.required],
      exitLoadPercentage: [{ value: this.sellMutualFundInvestment.exitLoadPercentage, disabled: true }, Validators.required],
      exitLoadApplicableMinimumDuration: [{ value: this.sellMutualFundInvestment.exitLoadApplicableMinimumDuration, disabled: true }, Validators.required],
      leinMarkedAmount: [{ value: this.sellMutualFundInvestment.leinMarkedAmount, disabled: true }, Validators.required],
      leinMarkedUtilizationAmount: [{ value: this.sellMutualFundInvestment.leinMarkedUtilitzationAmount, disabled: true }, Validators.required],
      transactionFrequency: [{ value: null }, Validators.required],
      periodOfInvestment: [{ value: 0 }, Validators.required]
    }, { validators: [checkQuantity('transactionQuantity', this.sellMutualFundInvestment.transaction.portfolio.quantity), notZero("periodOfInvestment")] });

    if (this.isEdit) {
      if (this.sellMutualFundInvestment.transaction.transactionAmount == 0 && this.sellMutualFundInvestment.transaction.quantity != 0) {
        this.sellMutualFund.patchValue({ transactionType: false });
        this.onTransactionTypeSelection({ value: 'false' });
      } else {
        this.sellMutualFund.patchValue({ transactionType: true });
        this.onTransactionTypeSelection({ value: 'true' });
      }
    }
  }

  get f() { return this.sellMutualFund.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    let mutualFundInvestmentMethod = MutualFundInvestmentMethod.LUMP_SUM_INVESTMENT.valueOf();
    let transactionFrequency = TransactionFrequency.NONE.valueOf();
    let periodOfInvestment = 0;
    if (this.isSWP) {
      mutualFundInvestmentMethod = MutualFundInvestmentMethod.SYSTEMATIC_WITHDRAWAL_PLAN.valueOf();
      transactionFrequency = form.value.transactionFrequency;
      periodOfInvestment = form.value.periodOfInvestment;
    }
    this.isLoading = true;
    this.spinner.show();
    const mutualFundInvestment: MutualFundInvestment = {
      investmentId: null,
      netAssetValue: this.sellMutualFundInvestment.netAssetValue,
      schemeType: this.sellMutualFundInvestment.schemeType,
      transaction: {
        transactionAmount: form.value.transactionAmount,
        transactionSide: 'SELL',
        quantity: form.value.transactionQuantity,
        transactionDate: this.convertDateToString(new Date()),
        valueDate: this.convertDateToString(new Date(form.value.valueDate)),
        debitAccount: this.sellMutualFundInvestment.transaction.debitAccount,
        updatedTime: null,
        transactionStatus: this.sellMutualFundInvestment.transaction.transactionStatus,
        holdingIntention: this.sellMutualFundInvestment.transaction.holdingIntention,
        countryOfInvestment: this.sellMutualFundInvestment.transaction.countryOfInvestment,
        portfolio: this.sellMutualFundInvestment.transaction.portfolio,
        transactionFrequency: transactionFrequency,
        nextValueDate: null,
        endDate: null
      },
      company: this.sellMutualFundInvestment.company,
      transactionNav: null,
      exitLoadPercentage: this.sellMutualFundInvestment.exitLoadPercentage,
      exitLoadApplicableMinimumDuration: this.sellMutualFundInvestment.exitLoadApplicableMinimumDuration,
      leinMarkedAmount: this.sellMutualFundInvestment.leinMarkedAmount,
      leinMarkedUtilitzationAmount: this.sellMutualFundInvestment.leinMarkedUtilizationAmount,
      mutualFundInvestmentMethod: mutualFundInvestmentMethod,
      periodOfInvestment: periodOfInvestment,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      version: null,
      taxDetails: null
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

  onTransactionTypeSelection(event) {
    if (event.value === 'true') {
      this.f.transactionQuantity.setValue(0);
      this.f.transactionAmount.enable();
      this.f.transactionQuantity.disable();
    } else {
      this.f.transactionAmount.setValue(0);
      this.f.transactionQuantity.enable();
      this.f.transactionAmount.disable();
    }
  }

  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

}
