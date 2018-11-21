import { AuthData } from './../auth.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  signupForm: FormGroup;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initSignupForm();
  }

  initSignupForm() {
    this.signupForm = new FormGroup({
      'email': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(7),
          Validators.email
        ]
      }),
      'username': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(2)
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

  onSignup() {
    if (this.signupForm.invalid) {
      return;
    }
    const user: AuthData = {
      email: this.signupForm.value.email,
      username: this.signupForm.value.username,
      password: this.signupForm.value.password
    }
    this.authService.createUser(user);
    this.isLoading = true;
  }

}
