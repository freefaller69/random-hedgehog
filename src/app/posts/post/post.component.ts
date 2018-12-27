import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from './../../auth/auth.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

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
  faTrash = faTrashAlt;
  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  likes: number = 0;
  dislikes: number = 0;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userName = this.authService.getUserName();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUserName();
      });
      this.initCommentForm();
    this.likes = this.post.likedBy.length;
    this.dislikes = this.post.dislikedBy.length;
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

  onDeleteComment(e) {
    this.post.comments.splice(e.index, 1);
    this.postsService.deleteComment(this.post.id, e.id);
  }

  // TODO - refactor the onVote method
  onVote(postId: string, voteType: string) {
    const hasVotedUp = this.post.likedBy.indexOf(this.userName);
    const hasVotedDown = this.post.dislikedBy.indexOf(this.userName);
    if (voteType === 'up') {
      if (hasVotedUp > -1) {
        this.post.likedBy.splice(hasVotedUp, 1);
      } else if (hasVotedDown > -1) {
        this.post.dislikedBy.splice(hasVotedDown, 1);
        this.dislikes = this.post.dislikedBy.length;
        this.post.likedBy.push(this.userName);
      } else {
        this.post.likedBy.push(this.userName);
      }
      this.likes = this.post.likedBy.length;
    } else {
      if (hasVotedDown > -1) {
        this.post.dislikedBy.splice(hasVotedDown, 1);
      } else if (hasVotedUp > -1) {
        this.post.likedBy.splice(hasVotedUp, 1);
        this.likes = this.post.likedBy.length;
        this.post.dislikedBy.push(this.userName);
      } else {
        this.post.dislikedBy.push(this.userName);
      }
      this.dislikes = this.post.dislikedBy.length;
    }
    this.postsService.postSocialAction(postId, this.postIndex, voteType);
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

}
