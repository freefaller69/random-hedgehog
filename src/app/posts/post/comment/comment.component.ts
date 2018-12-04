import { Component, OnInit, Input } from '@angular/core';

import { Comment } from './../../post.model';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment;

  constructor() { }

  ngOnInit() {
    // console.log(this.comment);
  }

}
