import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  date1: Date = new Date();
  date2: Date = new Date();
  date3: Date = new Date();

  // posts = [
  //   { username: 'ringo', post: 'Are you guys high? Clearly I need a longer post in here to test the width of elements.', createdAt: this.date3 },
  //   { username: 'walrus', post: 'I am the walrus', createdAt: this.date2 },
  //   { username: 'eggman', post: 'I am the eggman', createdAt: this.date1 },
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(
    public postsService: PostsService
  ) { }

  ngOnInit() {
    this.date1.setDate(this.date1.getDate() - (Math.random() * 10));
    this.date2.setDate(this.date1.getDate() - (Math.random() * 20));
    this.date3.setDate(this.date1.getDate() - (Math.random() * 30));
    this.posts = this.postsService.getPosts();
    this.postsService.getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
