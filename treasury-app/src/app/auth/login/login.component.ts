import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: any = null;
  isLoading = false;

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onFormSubmit(form: FormGroup, formGroupDirective: FormGroupDirective) {
    this.isLoading = true;
    this.spinner.show();
    this.authService.login(form.get('username').value, form.get('password').value, (error) => {
      if (!error) {
        this.router.navigateByUrl('/home');
      }
      this.isLoading = false;
      this.spinner.hide();
      this.errorMessage = error;
      formGroupDirective.resetForm();
      form.reset();
    });
  }

}
