import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, filter, first } from 'rxjs/operators';

import { PostEntityService } from './post-entity.service';

@Injectable({
  providedIn: 'root'
})
export class PostsResolver implements Resolve<boolean> {

  constructor(
    private postsService: PostEntityService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.postsService.loaded$.pipe(
      tap(loaded => {
        if (!loaded) {
          this.postsService.getAll();
        }
      }),
      filter(loaded => !!loaded),
      first()
    );
  }
}
