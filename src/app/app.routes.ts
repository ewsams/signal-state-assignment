import { Routes } from '@angular/router';
import { PostsComponent } from './stand-alone-components/posts-components/posts/posts.component';

export const routes: Routes = [
  { path: '', component: PostsComponent },
  { path: 'posts', component: PostsComponent },
];
