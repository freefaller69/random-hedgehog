import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from './../auth/auth.service';
import { PostEntityService } from './post-entity.service';
import { Post } from './post.model';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {
  posts$: Observable<Post[]>;
  isLoading = false;
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 25;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50];
  userIsAuthenticated = false;
  createCommentForm: FormGroup;
  private authStatusSubs: Subscription;

  constructor(
    private postsEntityService: PostEntityService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.reload();
  }

  reload() {
    this.posts$ = this.postsEntityService.entities$;
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }

}
