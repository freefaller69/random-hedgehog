import { AuthData } from './auth.model';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Auth Service] User Login',
  props<{user: AuthData}>()
);

export const logout = createAction(
  '[Header Menu], Logout'
);
