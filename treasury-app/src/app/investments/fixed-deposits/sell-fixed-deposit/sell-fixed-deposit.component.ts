import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { checkQuantity, notZero } from '../../../util/form.validators';
import { WorkflowActionRequest } from '../../../models/workflow-action-request.model';
import { Investment } from '../../../models/investment.model';
import { TransactionService } from '../../../services/transactions.service';
import { FixedDepositInvestment } from 'src/app/models/fixed-deposit.model';
import { Company } from 'src/app/models/company.model';
import { Constants } from 'src/app/util/constants.component';
import { AccountService } from 'src/app/services/account.service';
import { CompanyService } from 'src/app/services/company.service';
import { CounterPartyService } from 'src/app/services/counterparty.service';
import { CounterParty } from 'src/app/models/counterparty.model';
import { Account } from 'src/app/models/account.model';
import { InterestDetailListComponent } from '../../interest-detail-list/interest-detail-list.component';
import { MatDialog } from '@angular/material/dialog';
import { InterestRatesListComponent } from '../../interest-rates-list/interest-rates-list.component';
import { InvestmentType } from 'src/app/enums/investment-type.enum';

@Component({
  selector: 'app-sell-fixed-deposit',
  templateUrl: './sell-fixed-deposit.component.html',
  styleUrls: ['./sell-fixed-deposit.component.css']
})
export class SellFixedDepositComponent implements OnInit {

  sellFixedDeposit: FormGroup;
  @Input() sellFixedDepositInvestment;
  @Output() transactionUpdated = new EventEmitter();

  
  errorMessage: any = null;
  isLoading = false;
  companies: Company[];
  accounts: Account[];
  counterParties: CounterParty[];
  isLeinMarked:boolean=false;
  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private spinner: NgxSpinnerService,
    private accountService: AccountService,
    private companyService: CompanyService,
    private counterPartyService: CounterPartyService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.counterPartyService.getEnabledCounterParties(InvestmentType.FIXED_DEPOSITS).subscribe(response => {
      this.counterParties = response;
    });

    
    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(response => {
      this.companies = response.content;
    }); 
    
    this.companyService.getCompanyAccounts(this.sellFixedDepositInvestment.company.companyId).subscribe(res => {
      this.accounts = res;
      
    });
     
    
    if(this.sellFixedDepositInvestment.leinMarkedAmount && this.sellFixedDepositInvestment.leinMarkedAmount != 0){
      this.isLeinMarked = true;
    }

    this.sellFixedDeposit = this.fb.group({
      company: [{ value: this.sellFixedDepositInvestment.company, disabled: true}, Validators.required], 
      counterParty: [{ value: this.sellFixedDepositInvestment.counterParty, disabled: true}, Validators.required],
      fdrNumber: [{ value: this.sellFixedDepositInvestment.fdrNumber, disabled: true}, Validators.nullValidator],
      creditAccount: [{ value: this.sellFixedDepositInvestment.transaction.debitAccount, disabled: false}, Validators.required],
      isLeinClosed: [{value:this.isLeinMarked,disabled: !this.isLeinMarked}, Validators.required],
      leinClosuredate: [{ value: null, disabled: !this.isLeinMarked}, Validators.required],
      preClosureDate: [{ value: null, disabled: false}, Validators.required],
      }, { validators: [this.leinClosedNoValidation("isLeinClosed"),     
      this.dtPreClosureLessThanLeinClosure("leinClosuredate"),
      this.dtPreClosureLessThanLeinClosure("preClosureDate")
    ] });
  }

  leinClosedNoValidation(controlName: string) {    
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];  
      if (control.errors ) {
        // return if another validator has already found an error on the control
        return;
      }  
      // set error on matchingControl if validation fails
      if (this.isLeinMarked == true && (control.value == false||control.value == "false")) {
        control.setErrors({ leinCloseRequired: true });
      } else {
        control.setErrors(null);
      }
    }
  }

  dtPreClosureLessThanLeinClosure(controlName: string){
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];  
      if (control.errors ) {
        // return if another validator has already found an error on the control
        return;
      }  
      
      // set error on matchingControl if validation fails
      if (formGroup.controls["preClosureDate"].value < formGroup.controls["leinClosuredate"].value) {
        formGroup.controls["preClosureDate"].setErrors({ preClosureDtLessLeinClosure: true });        
      } else {
        //control.setErrors(null);
        formGroup.controls["preClosureDate"].setErrors(null);        
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

  onLeinClosedChange(event) {
    if (event.value === 'true') {
      this.f.leinClosuredate.enable();
    } else {
      this.f.leinClosuredate.disable();
    }
  }
  onShowInterestRates(){    
    let fdrNumber = this.sellFixedDepositInvestment.counterParty.counterPartyName + " - " + this.sellFixedDepositInvestment.fdrNumber; 
    let interestRates = this.sellFixedDepositInvestment.interestRates;
    let investmentId = this.sellFixedDepositInvestment.investmentId;
    let investmentType = this.sellFixedDepositInvestment.investmentType;
    const dialogRef = this.dialog.open(InterestRatesListComponent, {
      data: { fdrNumber: fdrNumber, interestRates: interestRates, editAllowed: true,investmentId:investmentId,investmentType:investmentType},
      height: '600px',
      width: '600px'
    })
    .afterClosed()
    .subscribe(response => {  
      this.sellFixedDepositInvestment.interestRates=response.resData.interestRates;    
      
    });
  }
  get f() { return this.sellFixedDeposit.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
      const fixedDepositInvestment: FixedDepositInvestment = {
        investmentId: this.sellFixedDepositInvestment.investmentId,
        transaction: {
          transactionAmount: this.sellFixedDepositInvestment.transaction.transactionAmount,
          transactionSide: 'SELL',
          quantity: this.sellFixedDepositInvestment.transaction.quantity,
          transactionDate: this.convertDateToString(new Date()),
          valueDate: this.convertDateToString(new Date(this.sellFixedDepositInvestment.transaction.valueDate)),
          debitAccount: this.sellFixedDepositInvestment.transaction.debitAccount,
          updatedTime: null,
          transactionStatus: this.sellFixedDepositInvestment.transaction.transactionStatus,
          holdingIntention: this.sellFixedDepositInvestment.transaction.holdingIntention,
          countryOfInvestment: this.sellFixedDepositInvestment.transaction.countryOfInvestment,
          portfolio: this.sellFixedDepositInvestment.transaction.portfolio,
          transactionFrequency: null,
          nextValueDate: null,
          endDate: this.sellFixedDepositInvestment.transaction.endDate
        },
        company: this.sellFixedDepositInvestment.company,
        leinMarkedAmount: this.sellFixedDepositInvestment.leinMarkedAmount,
        leinMarkedUtilitzationAmount: this.sellFixedDepositInvestment.leinMarkedUtilizationAmount,
        fdrNumber: this.sellFixedDepositInvestment.fdrNumber,
        counterParty: this.sellFixedDepositInvestment.counterParty,
        interestRate: this.sellFixedDepositInvestment.interestRate,
        interestRates: this.sellFixedDepositInvestment.interestRates,
        conventionalDays: this.sellFixedDepositInvestment.conventionalDays,
        compoundingType: this.sellFixedDepositInvestment.compoundingType,
        interestCalculationFactor: this.sellFixedDepositInvestment.interestCalculationFactor,
        callable: this.sellFixedDepositInvestment.callable,
        floating: this.sellFixedDepositInvestment.floating,
        createdBy: null,
        createdDate: null,
        lastModifiedBy: null,
        lastModifiedDate: null,
        version: null,
        taxDetails: null,
        preClosureDate:this.convertDateToString(new Date(form.value.preClosureDate))
      }

      this.transactionService.addFixedDepositInvestment(fixedDepositInvestment)
        .pipe(finalize(() => {
          this.isLoading = false;
          this.spinner.hide();
        }))
        .subscribe(res => {
          this.transactionUpdated.emit(res);
        }, err => {
          this.errorMessage = err.error.error;
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
