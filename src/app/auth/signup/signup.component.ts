import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  signupForm: FormGroup;

  constructor() { }

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
    console.log(this.signupForm);
  }

}
