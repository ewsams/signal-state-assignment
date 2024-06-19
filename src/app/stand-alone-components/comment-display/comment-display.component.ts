import { Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Comment } from '../../models/Comment.model';
import { PostsService } from '../../services/posts.service';
import { MatMiniFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  generateRandomSentence,
  generateRandomEmail,
  generateRandomName,
} from '../../services/posts-service-helper-methods';

@Component({
  selector: 'app-comment-display',
  standalone: true,
  imports: [MatIcon, MatMiniFabButton, MatCardModule],
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
    const updatedComment = {
      ...comment,
      name: generateRandomName(),
      email: generateRandomEmail(),
      body: generateRandomSentence(10),
    };
    this.postService.updateCommentForPost(postId, updatedComment);
  }
}
