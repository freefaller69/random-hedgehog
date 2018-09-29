import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts() {
    // return [...this.posts];
    this.http.get<{ message: string, posts: any }>(BACKEND_URL)
      .pipe(
        map(postData => {
        return postData.posts.map(post => {
          return {
            post: post.post,
            id: post._id,
            comments: post.comments,
            created: post.created_at
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    this.http.post<{ message: string, postId: string }>(BACKEND_URL, post)
      .subscribe(responseData => {
        const id = responseData.postId;
        console.log('XXXX', responseData);
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })
  }

  postComment(id: string, comment: string, index: number) {
    const commentData = {
      id: id,
      // userId: userId,
      comment: comment
    };
    this.http.post<{ message: string, comment: string }>(BACKEND_URL + 'comment', commentData)
      .subscribe((responseData) => {
        const comment = responseData.comment;
        this.posts[index].comments.push(comment);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  // postComment(id: string, comment: string, userId: string) {
  //   const postData = {
  //     id: id,
  //     userId: userId,
  //     comment: comment
  //   };
  //   this.http.post(BACKEND_URL + 'comment', postData)
  //     .subscribe((responseData) => {
  //       this.router.navigate(['/']);
  //     });
  // }

  deletePost(postId: string) {
    this.http.delete(BACKEND_URL + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
