import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from './post.model';
import { AuthService } from './../auth/auth.service';
import { PostsService } from './posts.service';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 25;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];
  userIsAuthenticated = false;
  userId: string;
  userName: string;
  createCommentForm: FormGroup;
  private postsSub: Subscription;
  private authStatusSubs: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.initCommentForm();
  }

  initCommentForm() {
    this.createCommentForm = new FormGroup({
      'comment': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(1)
        ]
      }),
      // 'commentator': new FormControl(null, {
      //   validators: [
      //     Validators.required,
      //   ]
      // })
    });
  }

  postComment(id: string) {
    this.isLoading = true;
    const index = this.posts.findIndex(x => x.id === id);
    const comment = this.createCommentForm.get('comment').value;
    this.postsService.postComment(id, comment, index);
    this.createCommentForm.reset();
    this.totalPosts = this.postsService.updatedPostCount();
    this.isLoading = false;
  }

  cancelSubmit(id: string) {
    this.createCommentForm.reset();
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

}
