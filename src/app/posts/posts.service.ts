import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({
  providedIn: 'root'
})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private totalPosts: number;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
        return { posts: postData.posts.map(post => {
          return {
            post: post.post,
            id: post._id,
            comments: post.comments,
            created: post.created_at
          };
        }),
      maxPosts: postData.maxPosts
    };
      }))
      .subscribe((transformedPostData$) => {
        this.posts = transformedPostData$.posts;
        this.totalPosts = transformedPostData$.maxPosts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData$.maxPosts
        });
      });
  }

  updatedPostCount() {
    return this.totalPosts;
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    this.http.post<{ message: string, postId: string }>(BACKEND_URL, post)
      .subscribe(responseData => {
        const id = responseData.postId;
        const count = this.updatedPostCount();
        post.id = id;
        this.totalPosts += 1;
        this.posts.unshift(post);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
        console.log('addPost', responseData);
      })
  }

  postComment(id: string, comment: string, index: number) {
    const commentData = {
      id: id,
      // userId: userId,
      comment: comment
    };
    this.http.post<{ message: string, comment: string }>(BACKEND_URL + '/comment', commentData)
      .subscribe((responseData) => {
        const comment = responseData.comment;
        if (!this.posts[index].comments) {
          this.posts[index].comments = [comment];
        } else {
          this.posts[index].comments.push(comment);
        }
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
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
    this.http.delete(BACKEND_URL + '/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.totalPosts -= 1;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
      });
  }
}
