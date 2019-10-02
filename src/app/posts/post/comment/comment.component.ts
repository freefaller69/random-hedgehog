import { PostsService } from './../../posts.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Comment } from './../../post.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;
  @Input() cIdx;
  @Input() userId;
  @Input() userIsAuthenticated = false;
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit() {
  }

  onDeleteComment() {
    const cmt = {
      id: this.comment._id,
      index: this.cIdx
    };
    this.deleteEvent.emit(cmt);
  }

}
