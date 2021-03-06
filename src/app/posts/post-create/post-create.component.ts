import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { Post } from '../post.model';
import { PostsService } from './../posts.service';
import { PostEntityService } from '../post-entity.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  createPostForm: FormGroup;
  @ViewChild('autosize', { static: true }) autosize: CdkTextareaAutosize;

  constructor(
    public postsService: PostsService,
    private postsEntityService: PostEntityService,
    private ngZone: NgZone
  ) { }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  ngOnInit() {
    this.initPostForm();
  }

  initPostForm() {
    this.createPostForm = new FormGroup({
      'post': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(2)
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
    };
    this.postsEntityService.add(post).subscribe();
    this.createPostForm.reset();
  }

}
