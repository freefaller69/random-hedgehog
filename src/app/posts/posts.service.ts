import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Comment, Post } from './post.model';

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
  ) { }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addComment(id: string, comment: string, postIndex: number) {
    const commentData = {
      id: id,
      comment: comment
    };
    this.http.put<{ message: string, comment: Comment }>(BACKEND_URL + '/comment', commentData)
      .subscribe((responseData) => {
        const comment = responseData.comment;
        this.posts[postIndex].comments.push(comment);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
      });
  }

  deleteComment(postId: string, commentId: string) {
    const requestUrl = `${BACKEND_URL}/${postId}/comment/${commentId}`;
    this.http.delete(requestUrl)
      .subscribe(() => {
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
      });
  }
}
