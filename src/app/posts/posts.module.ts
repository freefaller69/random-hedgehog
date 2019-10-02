import { PostsDataService } from './posts-data.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostsComponent } from './posts.component';
import { PostComponent } from './post/post.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentComponent } from './post/comment/comment.component';
import { EntityMetadataMap, EntityDefinitionService, EntityDataService } from '@ngrx/data';
import { sortPosts } from './post.model';

const entityMetaData: EntityMetadataMap = {
  Post: {
    sortComparer: sortPosts
  }
};

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
export class PostsModule {
  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private postsDataService: PostsDataService
  ) {
    eds.registerMetadataMap(entityMetaData);

    entityDataService.registerService('Post', postsDataService);
  }
}
