import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostsComponent } from './posts.component';
import { PostComponent } from './post/post.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentComponent } from './post/comment/comment.component';



@NgModule({
  declarations: [
    PostComponent,
    CommentComponent,
    PostsComponent,
    PostCreateComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AngularMaterialModule
  ]
})
export class PostsModule { }
