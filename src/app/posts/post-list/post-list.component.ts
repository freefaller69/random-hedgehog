import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  isLoading = false;
  posts: Post[] = [];
  createCommentForm: FormGroup;
  private postsSub: Subscription;

  constructor(
    public postsService: PostsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
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
    this.isLoading = false;
  }

  cancelSubmit(id: string) {
    this.createCommentForm.reset();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
