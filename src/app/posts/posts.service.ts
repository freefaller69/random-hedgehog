import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
            creatorId: post.creator._id,
            creator: post.creator.username,
            likedBy: post.likedBy,
            dislikedBy: post.dislikedBy,
            created_at: post.created_at
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
    this.http.post<{ message: string, postId: string, username: string, created_at: Date, comments: Comment[] }>(BACKEND_URL, post)
      .subscribe(responseData => {
        const count = this.updatedPostCount();

        post.id = responseData.postId;
        post.created_at = responseData.created_at;
        post.creator = localStorage.getItem('userName');
        post.creatorId = localStorage.getItem('userId');
        post.comments = responseData.comments;

        this.totalPosts += 1;
        this.posts.unshift(post);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
      })
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
      })
  }

  postSocialAction(id: string, postIndex: number, voteType: string) {
    const socialData = {
      id: id,
      postIndex: postIndex,
      voteType: voteType
    }
    this.http.put<{ message: string }>(BACKEND_URL + '/social', socialData)
      .subscribe((responseData) => {
        console.log(responseData);
        // const comment = responseData.comment;
        // this.posts[postIndex].comments.push(comment);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
      });
  }

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

  deleteComment(postId: string, commentId: string) {
    const requestUrl = `${BACKEND_URL}/${postId}/comment/${commentId}`;
    this.http.delete(requestUrl)
      .subscribe(() => {
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.totalPosts
        });
      })
  }

  socialAction(id, action) {
    console.log('social action on ', id);
    console.log('social action type ', action);
  }
}
