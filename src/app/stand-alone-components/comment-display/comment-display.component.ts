import { Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Comment } from '../../models/Comment.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-comment-display',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './comment-display.component.html',
  styleUrl: './comment-display.component.scss',
})
export class CommentDisplayComponent {
  private postService = inject(PostsService);

  comments = input<Comment[]>([]);
  maxLength = input<number>(30);
  updateComment = output<number>();
  removeComment = output<number>();

  onRemoveComment(postId: number, commentId: number) {
    this.postService.removeCommentFromPost(postId, commentId);
  }

  onUpdateComment(postId: number, comment: Comment) {
    this.postService.updateCommentForPost(postId, comment);
  }
}
