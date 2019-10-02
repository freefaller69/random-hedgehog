import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './reducers/index';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './reducers';
import { AuthEffects } from './auth.effects';



@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    StoreModule.forFeature(
      fromAuth.authFeatureKey,
      authReducer
    ),
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class AuthModule { }
