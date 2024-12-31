import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { TransactionService } from '../../../services/transactions.service';
import { notZero } from '../../../util/form.validators';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-close-loan',
  templateUrl: './close-loan.component.html',
  styleUrls: ['./close-loan.component.css']
})
export class CloseLoanComponent implements OnInit {

  closeLoanVerifyForm: FormGroup;
  investmentDetails: any;
  success: boolean = false;
  showOutstanding: boolean = false;
  outstandingMessage: string = '';
  closureAmount: number = 0;
  isLoading: boolean = false;
  errorMessage: any = null;
  minDate: Date;
  maxDate: Date = new Date();
  investmentNo: string;

  constructor(public dialogRef: MatDialogRef<CloseLoanComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private currencyPipe: CurrencyPipe,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.success = false;
    this.investmentDetails = this.data.RowData;
    this.investmentNo = this.data.InvNumber;

    this.minDate = new Date(this.investmentDetails.loanTransactions.sort((a,b) => 
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())[0].transactionDate);

    this.closeLoanVerifyForm = this.fb.group({
      InvestmentNumber: [{ value: this.investmentNo, disabled: true }, Validators.nullValidator],
      transactionDate: [null, [Validators.required]],
      transactionAmount: [null, Validators.min(this.closureAmount)]
    });
  }


  get f() { return this.closeLoanVerifyForm.controls; }

  onCancel() {
    this.dialogRef.close();
  }

  getClosureAmount() {
    if (this.closeLoanVerifyForm.controls.transactionDate.valid) {
      this.closeLoanVerifyForm.controls.transactionAmount.clearValidators();
      this.transactionService.getClosureAmountForLoanAsOn(this.investmentDetails.investmentType, this.investmentDetails.investmentId,
        this.convertDateToString(this.closeLoanVerifyForm.value.transactionDate))
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.showOutstanding = true;
          this.closureAmount = res as number;
          this.outstandingMessage = 'The loan closure amount on ' + this.convertDateToString(this.closeLoanVerifyForm.value.transactionDate) + ' is ' + this.currencyPipe.transform(res.toString());

          this.closeLoanVerifyForm.controls.transactionAmount.addValidators([Validators.min((res as number) - 0.01), Validators.required]);
          this.closeLoanVerifyForm.controls.transactionAmount.markAsTouched();

        }, err => {
          if (err.error)
            this.errorMessage = err.error.errorMessages;
          else
            this.success = true;

        });
    }
  }

  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();

    this.transactionService.closeLoan(this.investmentDetails.investmentType, this.investmentDetails.investmentId, 
      this.convertDateToString(form.value.transactionDate), form.value.transactionAmount)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.spinner.hide();
      }))
      .subscribe(res => {
        this.success = true;
      }, err => {
        if (err.error)
          this.errorMessage = err.error.errorMessages;
        else
          this.success = true;

      });


    form.disable();
    formGroupDirective.resetForm();
    this.outstandingMessage = '';
    this.showOutstanding = false;
    form.reset();
  }
}