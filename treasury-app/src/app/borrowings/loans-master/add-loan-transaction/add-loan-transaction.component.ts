import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { LoanTransaction } from '../../../models/loan-transaction.model';
import { EnumService } from '../../../services/enum.service';
import { TransactionService } from '../../../services/transactions.service';
import { notZero } from '../../../util/form.validators';

@Component({
  selector: 'app-add-loan-transaction',
  templateUrl: './add-loan-transaction.component.html',
  styleUrls: ['./add-loan-transaction.component.css']
})
export class AddLoanTransactionComponent implements OnInit {
  
  addLoanTransactionForm: FormGroup;
  investmentDetails:any;
  success:boolean = false;
  isLoading: boolean = false;
  errorMessage: any = null;
  investmentNo:string;
  loanTransactionTypes: [];

  constructor(public dialogRef: MatDialogRef<AddLoanTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private enumService: EnumService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.success = false;
    this.investmentDetails = this.data.RowData;
    this.investmentNo = this.data.InvNumber;

    this.enumService.getLoanTransactionTypes(this.data.RowData.borrowing).subscribe(response => {
      this.loanTransactionTypes = response;
    });

    this.addLoanTransactionForm = this.fb.group({
      InvestmentNumber: [{value:this.investmentNo,disabled:true}, Validators.nullValidator],
      transactionAmount: [this.investmentDetails.transactionAmount, [Validators.required, Validators.min(0)]],
      loanTransactionType: [null, [Validators.required]],
      transactionDate: [null, Validators.required],
      remark: [null, [Validators.minLength(3), Validators.maxLength(200)]]
    }, { validators: [notZero("transactionAmount")] });
  }


  get f() { return this.addLoanTransactionForm.controls; }

  onCancel() {
    this.dialogRef.close();
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

    const addLoan:LoanTransaction  = {
      transactionDate: this.convertDateToString(new Date(form.value.transactionDate)),
      transactionAmount: form.value.transactionAmount,
      loanTransactionType: form.value.loanTransactionType,
      closureTransaction: false,
      chargedInterestAmount: 0,
      remark: form.value.remark
    };

    this.transactionService.addLoanTransaction(this.investmentDetails.investmentType,this.investmentDetails.investmentId,addLoan)
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
    form.reset();
  }
}
