import { PostsComponent } from './posts/posts.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: PostsComponent },
  { path: '**', component: PostsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
