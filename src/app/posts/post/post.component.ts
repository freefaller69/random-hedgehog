import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from './../../auth/auth.service';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() postIndex: number;
  @Input() post: Post;
  @Input() userIsAuthenticated = false;

  isLoading = false;
  userId: string;
  userName: string;
  createCommentForm: FormGroup;
  private authStatusSubs: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.initCommentForm();
    this.isLoading = false;
  }

  initCommentForm() {
    this.createCommentForm = new FormGroup({
      'comment': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(1)
        ]
      })
    });
  }

  postComment(id: string) {
    this.isLoading = true;
    const comment = this.createCommentForm.get('comment').value;
    this.postsService.addComment(id, comment, this.postIndex);
    this.createCommentForm.reset();
    this.isLoading = false;
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

}
