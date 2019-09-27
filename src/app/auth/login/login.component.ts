import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthData } from '../auth.model';
import { AuthService } from './../auth.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(7),
          Validators.email
        ]
      }),
      'password': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ]
      }),
    });
  }

  login() {
    const user = this.loginForm.value;
    this.authService.login(user);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const user: AuthData = this.loginForm.value;
    this.authService.login(user);
  }

}
