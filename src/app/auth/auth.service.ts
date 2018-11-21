import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AuthData } from './auth.model';
import { EmailValidator } from '@angular/forms';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();

  constructor(
    private http: HttpClient
  ) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(user) {
    this.http.post(BACKEND_URL + '/signup', user)
      .subscribe(response => {
        console.log(response);
      }
    );
  }

  login(user) {
    // const authData: AuthData = {
    //   email: email,
    //   password: password
    // }
    this.http.post<{ token: string }>(BACKEND_URL + '/login', user)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        }
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}