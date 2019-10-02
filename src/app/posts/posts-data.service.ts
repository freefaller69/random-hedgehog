import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Post } from './post.model';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostsDataService extends DefaultDataService<Post> {

  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator,
    private store: Store<AppState>
  ) {
    super('Posts', http, httpUrlGenerator);
    this.httpUrlGenerator.registerHttpResourceUrls();
    this.entitiesUrl = BACKEND_URL;
    this.entityUrl = BACKEND_URL;
  }

  getAll(): Observable<Post[]> {
    return this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL).pipe(
      map(postData => {
        console.log('postData', postData);
        return postData.posts.map(post => {
          return {
            post: post.post,
            id: post._id,
            comments: post.comments,
            creatorId: post.creator._id,
            creator: post.creator.username,
            creatorName: post.creator.username,
            created_at: post.created_at
          };
        });
      }),
      tap(mappedData => console.log('mappedData', mappedData))
    );
  }

  add(post): Observable<Post> {
    return this.http.post<{ message: string, postId: string, post: Post }>(BACKEND_URL, post).pipe(
      map(responseData => responseData.post),
    );
  }

}
