import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostsComponent } from './stand-alone-components/posts-components/posts/posts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PostsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'signal-state-assignment';
}
