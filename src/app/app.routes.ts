import { Routes } from '@angular/router';
import { PostsComponent } from './stand-alone-components/post-components/posts/posts.component';

export const routes: Routes = [
  { path: '', component: PostsComponent },
  { path: 'posts', component: PostsComponent },
];
