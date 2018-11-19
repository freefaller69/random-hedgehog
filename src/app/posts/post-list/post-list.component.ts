import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from './../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 25;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];
  createCommentForm: FormGroup;
  private postsSub: Subscription;

  constructor(
    public postsService: PostsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsService.getPostUpdatedListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
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
    // const userId = localStorage.getItem('userId');
    const comment = this.createCommentForm.get('comment').value;
    this.postsService.postComment(id, comment, index);
    this.createCommentForm.reset();
    this.totalPosts = this.postsService.updatedPostCount();
    console.log('new comment added', this.totalPosts);
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
    // this.isLoading = true;
    this.postsService.deletePost(postId);
    // this.totalPosts = this.postsService.updatedPostCount();
    // console.log('newCount', this.totalPosts);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
