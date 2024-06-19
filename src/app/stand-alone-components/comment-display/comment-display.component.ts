import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Comment } from '../../models/Comment.model';

@Component({
  selector: 'app-comment-display',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './comment-display.component.html',
  styleUrl: './comment-display.component.scss',
})
export class CommentDisplayComponent {
  comments = input<Comment[]>([]);
  maxLength = input<number>(30);
  // updateComment = output<number>();
  // removeComment = output<number>();
}
