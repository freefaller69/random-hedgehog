import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthData } from '../auth.model';
import { AuthService } from './../auth.service';

@Component({
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

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    const user: AuthData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }
    this.authService.login(user);
  }

}
