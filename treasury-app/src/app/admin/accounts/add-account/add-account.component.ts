import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '../../../models/account.model';
import { Company } from '../../../models/company.model';
import { Person } from '../../../models/person.model';
import { AddPersonComponent } from '../../person/add-person/add-person.component';
import { notBlank } from '../../../util/form.validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnumService } from '../../../services/enum.service';
import { CompanyService } from '../../../services/company.service';
import { PersonService } from '../../../services/person.service';
import { AccountService } from '../../../services/account.service';
import { Constants } from '../../../util/constants.component';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit, OnChanges {

  addAccountForm: FormGroup;

  currencies = [];
  companies: Company[];
  persons: Person[];

  errorMessage: any = null;
  isLoading = false;

  @Output() accountAdded = new EventEmitter();
  @Output() personAdded = new EventEmitter();

  @Input() companyUpdated: any;
  @Input() userUpdated: any;
  @Input() personUpdated: any;

  constructor (
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private companyService: CompanyService,
    private accountService: AccountService,
    private personService: PersonService,
    private enumService: EnumService
  ) { }

  ngOnInit(): void {
    this.addAccountForm = this.fb.group({
      accountNumber: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      nickname: [null, Validators.maxLength(80)],
      bankName: [null, [Validators.required, Validators.maxLength(80)]],
      ifscCode: [null, [Validators.required, Validators.maxLength(20)]],
      bankAccountGLCode: [null, Validators.maxLength(20)],
      openingBalance: [0.0],
      accountPurpose: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      primaryTeam: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      relationshipManager: [null],
      company: [null, Validators.required],
      accountCurrency: [null, Validators.required],
    }, { validators: [notBlank('accountNumber'), notBlank('bankName'), notBlank('ifscCode'), notBlank('accountPurpose'), notBlank('primaryTeam')] });
    this.enumService.getCurrencies().subscribe(res => {
      this.currencies = res;
    });
    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.companies = res.content;
    });
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
    });
  }

  ngOnChanges(): void {
    this.companyService.getAllCompanies(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.companies = res.content;
    });
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
    });
  }

  get f() { return this.addAccountForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const account: Account = {
      accountId: null,
      accountNumber: form.value.accountNumber,
      nickname: form.value.nickname,
      bankName: form.value.bankName,
      ifscCode: form.value.ifscCode,
      bankAccountGLCode: form.value.bankAccountGLCode,
      accountPurpose: form.value.accountPurpose,
      primaryTeam: form.value.primaryTeam,
      openingBalance: form.value.openingBalance,
      relationshipManager: form.value.relationshipManager,
      company: form.value.company,
      accountCurrency: form.value.accountCurrency,
      accountStatus: null,
      version: null,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null
    };
    this.accountService.addAccount(account).subscribe(res => {
      this.isLoading = false;
      this.spinner.hide();
      this.accountAdded.emit(res);
    }, err => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = err.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }

  onAddRelationshipManager() {
    const dialogRef = this.dialog.open(AddPersonComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personAdded.emit(result);
        this.personService.getAllPersons().subscribe(res => {
          this.persons = res.content;
        });
      }
    });
  }
}
