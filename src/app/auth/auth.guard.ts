import { isLoggedIn } from './auth.selectors';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { AppState } from '../reducers';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.store.pipe(
        select(isLoggedIn),
        tap(loggedIn => {
          if (!loggedIn) {
            this.router.navigate(['/']);
          }
        })
      );

    //   const isAuth = this.authService.getIsAuth();
    //   if (!isAuth) {
    //     this.router.navigate(['/']);
    //   }
    // return isAuth;
  }
}
