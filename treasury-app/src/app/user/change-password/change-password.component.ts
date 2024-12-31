import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormGroupDirective, FormBuilder } from '@angular/forms';
import { User } from '../../models/user.model';
import { PasswordReset } from '../../models/password-reset.model';
import { UserService } from '../user.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { notBlank, mustMatch } from '../../util/form.validators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  errorMessage: any = null;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  isLoading = false;

  @Input() user: User;
  @Output() userUpdated = new EventEmitter();

  constructor (
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmNewPassword: [null, Validators.required]
    }, { validators: [notBlank('newPassword'), mustMatch('newPassword', 'confirmNewPassword')] });
  }

  get f() { return this.changePasswordForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    const passwordResetForm: PasswordReset = {
      username: this.user.userName,
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword
    };
    this.userService.changePassword(passwordResetForm).subscribe(res => {
      this.isLoading = false;
      this.spinner.hide();
      this._snackBar.open('Password updated successfully!', 'X', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      });
      this.userUpdated.emit();
    }, err => {
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = err.error.errorMessages;
    });
    formGroupDirective.resetForm();
    form.reset();
  }

}
