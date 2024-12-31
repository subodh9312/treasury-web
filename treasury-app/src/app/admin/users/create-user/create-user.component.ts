import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { notBlank } from '../../../util/form.validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from '../../../util/constants.component';
import { Authority } from '../../../models/authority.model';
import { AuthorityService } from '../../../services/authority.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnChanges {

  createUserForm: FormGroup;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  authorityCtrl = new FormControl();
  authorities: string[] = [];
  allAuthorities: Authority[];
  allAuthoritiesName: string[] = [];
  errorMessage: any = null;
  isLoading = false;

  @ViewChild('authorityInput') authorityInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  @Output() userCreated = new EventEmitter();
  @Input() authorityUpdated: any;

  constructor (
    private fb: FormBuilder,
    private userService: UserService,
    private authorityService: AuthorityService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.authorityService.getAllAuthorities(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.allAuthorities = res.content;
      this.allAuthoritiesName = [...this.allAuthorities].map(authority => authority.context + "_" + authority.permission);
    });

    this.createUserForm = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: [null, Validators.required],
      active: [false],
      firstName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      lastName: [null, Validators.maxLength(20)],
      mobileNumber: [null, [Validators.required, Validators.maxLength(20)]],
      workPhone: [null, Validators.maxLength(20)],
      emailId: [null, [Validators.required, Validators.maxLength(80), Validators.email]],
      authorities: [[]]
    }, { validators: [notBlank('password'), notBlank('mobileNumber')] });
  }

  ngOnChanges() {
    this.authorityService.getAllAuthorities(0, Constants.MAX_PAGE_SIZE).subscribe(res => {
      this.allAuthorities = res.content;
      this.allAuthoritiesName = [...this.allAuthorities].map(authority => authority.context + "_" + authority.permission);
    });
  }

  get f() { return this.createUserForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    form.get("authorities").setValue(this.authorities.map(authorityName => this.allAuthorities.find(authority => (authority.context + "_" + authority.permission) === authorityName)));
    const user: User = {
      userName: form.value.userName,
      password: form.value.password,
      active: form.value.active,
      userDetails: {
        personId: null,
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        address: null,
        mobileNumber: form.value.mobileNumber,
        workPhone: form.value.workPhone,
        emailId: form.value.emailId
      },
      authorities: form.value.authorities,
      version: null,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null
    };
    this.userService.addUser(user).subscribe(res => {
      this.authorities = [];
      this.isLoading = false;
      this.spinner.hide();
      this.userCreated.emit(res);
    }, err => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = err.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our authority
    if ((value || '').trim() && !this.authorities.includes(value.trim())) {
      this.authorities.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(authorityName: string): void {
    this.authorities.splice(this.authorities.indexOf(authorityName), 1);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.authorities.includes(event.option.viewValue)) {
      this.authorities.push(event.option.viewValue);
    }
    this.authorityInput.nativeElement.value = '';
  }
}
