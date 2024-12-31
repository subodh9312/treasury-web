import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person } from '../../../models/person.model';
import { EnumService } from '../../../services/enum.service';
import { PersonService } from '../../../services/person.service';
import { notBlank } from '../../../util/form.validators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent implements OnInit {

  addPersonForm: FormGroup;
  errorMessage: any = null;
  countries = [];
  isLoading = false;

  constructor (
    public dialogRef: MatDialogRef<AddPersonComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private enumService: EnumService,
    private personService: PersonService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.addPersonForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: [null, Validators.maxLength(20)],
      mobileNumber: [null, [Validators.required, Validators.maxLength(20)]],
      workPhone: [null, Validators.maxLength(20)],
      emailId: [null, [Validators.required, Validators.maxLength(80), Validators.email]],
      addressLine1: [null, Validators.maxLength(200)],
      addressLine2: [null, Validators.maxLength(200)],
      nearestLandMark: [null, Validators.maxLength(200)],
      city: [null, Validators.maxLength(80)],
      state: [null, Validators.maxLength(80)],
      postalCode: [null, Validators.maxLength(10)],
      country: [null, Validators.maxLength(80)]
    }, { validators: [notBlank('firstName'), notBlank('mobileNumber')] });
    this.enumService.getCountries().subscribe(res => {
      this.countries = res;
    });
  }

  get f() { return this.addPersonForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const person: Person = {
      personId: null,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      mobileNumber: form.value.mobileNumber,
      workPhone: form.value.workPhone,
      emailId: form.value.emailId,
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
    const isAddressNull = Object.values(person.address).every(x => (x === null));
    if (isAddressNull) {
      delete person.address;
    }
    this.personService.addPerson(person).subscribe(res => {
      this.isLoading = false;
      this.spinner.hide();
      this.dialogRef.close(person);
    }, err => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = err.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }

  onCancel() {
    this.dialogRef.close();
  }

}
