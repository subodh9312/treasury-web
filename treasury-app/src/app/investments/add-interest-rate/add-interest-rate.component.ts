import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { TransactionService } from 'src/app/services/transactions.service';
import { notZero } from 'src/app/util/form.validators';
import { InterestRate } from '../../models/interest-rate.model';

@Component({
  selector: 'app-add-interest-rate',
  templateUrl: './add-interest-rate.component.html',
  styleUrls: ['./add-interest-rate.component.css']
})
export class AddInterestRateComponent implements OnInit {
  addInterestRateForm: FormGroup;
  investmentDetails:any;
  success:boolean = false;
  isLoading: boolean = false;
  errorMessage: any = null;
  investmentNo:string;
  constructor(public dialogRef: MatDialogRef<AddInterestRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.success = false;
    this.investmentDetails = this.data.RowData;
    this.investmentNo = this.data.InvNumber;

    this.addInterestRateForm = this.fb.group({
      InvestmentNumber: [{value:this.investmentNo,disabled:true}, Validators.nullValidator],
      interestRate: [this.investmentDetails.interestRate, [Validators.required, Validators.min(0), Validators.max(100)]],
      effectiveDate: [null, Validators.required],      
    }, { validators: [notZero("interestRate")] });
  }

  get f() { return this.addInterestRateForm.controls; }
  
  convertDateToString(date: Date) {
    return [
      date.getFullYear(),
      ('0' + (date.getMonth() + 1)).slice(-2),
      ('0' + date.getDate()).slice(-2)
    ].join('-');
  }

  onCancel() {
    this.dialogRef.close();
  }
  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    
    const addIR:InterestRate  = {      
      effectiveDate: this.convertDateToString(new Date(form.value.effectiveDate)),
      rate: form.value.interestRate,
    };

 
    this.transactionService.addInterestRate(this.investmentDetails.investmentType,this.investmentDetails.investmentId,addIR)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.success = true;
        }, err => {
          if(err.error)
            this.errorMessage = err.error.errorMessages;
          else
          this.success = true;
          
        });
     
        
    form.disable();        
    formGroupDirective.resetForm();
    form.reset();
  }
  

}
