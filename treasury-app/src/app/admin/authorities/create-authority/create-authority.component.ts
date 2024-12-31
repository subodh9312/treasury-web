import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorityService } from '../../../services/authority.service';

@Component({
  selector: 'app-create-authority',
  templateUrl: './create-authority.component.html',
  styleUrls: ['./create-authority.component.css']
})
export class CreateAuthorityComponent implements OnInit {

  createAuthorityForm: FormGroup;
  errorMessage: any = null;
  isLoading = false;

  @Output() authorityCreated = new EventEmitter();

  constructor (
    private fb: FormBuilder,
    private authorityService: AuthorityService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.createAuthorityForm = this.fb.group({
      context: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      permission: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      systemAdminAuthority: [false]
    });
  }

  get f() { return this.createAuthorityForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    this.authorityService.addAuthority(form.value).subscribe(res => {
      this.isLoading = false;
      this.spinner.hide();
      this.authorityCreated.emit(res);
    }, err => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = err.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }
}
