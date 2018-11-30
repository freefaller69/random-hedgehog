import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  createPostForm: FormGroup;

  constructor(
    public postsService: PostsService
  ) { }

  ngOnInit() {
    this.initPostForm();
  }

  initPostForm() {
    this.createPostForm = new FormGroup({
      'post': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(1)
        ]
      })
    });
  }

  onSavePost() {
    const post: Post = {
      id: null,
      username: null,
      created_at: null,
      post: this.createPostForm.value.post
    }
    this.postsService.addPost(post);
    this.createPostForm.reset();
  }

}
