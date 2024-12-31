import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Company } from '../../../models/company.model';
import { Person } from '../../../models/person.model';
import { CompanyService } from '../../../services/company.service';
import { EnumService } from '../../../services/enum.service';
import { PersonService } from '../../../services/person.service';
import { notBlank } from '../../../util/form.validators';
import { AddPersonComponent } from '../../person/add-person/add-person.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit, OnChanges {

  addCompanyForm: FormGroup;
  errorMessage: any = null;
  isLoading = false;
  persons: Person[];
  currencies = [];
  countries = [];

  @Output() companyCreated = new EventEmitter();
  @Output() personAdded = new EventEmitter();

  @Input() userUpdated: any;
  @Input() personUpdated: any;

  constructor (
    private fb: FormBuilder,
    public dialog: MatDialog,
    private personService: PersonService,
    private companyService: CompanyService,
    private enumService: EnumService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
    });
    this.enumService.getCountries().subscribe(res => {
      this.countries = res;
    });
    this.enumService.getCurrencies().subscribe(res => {
      this.currencies = res;
    });
    this.addCompanyForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      gstNumber: [null, Validators.maxLength(25)],
      pan: [null, Validators.maxLength(15)],
      accountingCurrency: [null, [Validators.required, Validators.maxLength(3)]],
      primaryContact: [null],
      legalEntityIdentifier: [null, Validators.maxLength(50)],
      addressLine1: [null, Validators.maxLength(200)],
      addressLine2: [null, Validators.maxLength(200)],
      nearestLandMark: [null, Validators.maxLength(200)],
      city: [null, Validators.maxLength(80)],
      state: [null, Validators.maxLength(80)],
      postalCode: [null, Validators.maxLength(10)],
      country: [null, Validators.maxLength(80)]
    }, { validators: [notBlank('name')] });
  }

  ngOnChanges(): void {
    this.personService.getAllPersons().subscribe(res => {
      this.persons = res.content;
    });
  }

  get f() { return this.addCompanyForm.controls; }

  onAddPrimaryContact() {
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

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const company: Company = {
      companyId: null,
      name: form.value.name,
      gstNumber: form.value.gstNumber,
      pan: form.value.pan,
      accountingCurrency: form.value.accountingCurrency,
      primaryContact: form.value.primaryContact,
      legalEntityIdentifier: form.value.legalEntityIdentifier,
      address: {
        addressId: null,
        addressLine1: form.value.addressLine1,
        addressLine2: form.value.addressLine2,
        nearestLandMark: form.value.nearestLandMark,
        city: form.value.city,
        state: form.value.state,
        postalCode: form.value.postalCode,
        country: form.value.country
      }
    };
    const isAddressNull = Object.values(company.address).every(x => (x === null));
    if (isAddressNull) {
      delete company.address;
    }
    this.companyService.addCompany(company).subscribe(res => {
      this.isLoading = false;
      this.spinner.hide();
      this.companyCreated.emit(res);
    }, err => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = err.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }

}
