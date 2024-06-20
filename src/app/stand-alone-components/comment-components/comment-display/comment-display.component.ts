import { Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Comment } from '../../../models/Comment.model';
import { PostsService } from '../../../services/posts.service';
import { MatMiniFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CommentFormDialogComponent } from '../comment-form-dialog/comment-form-dialog.component';
import { tap } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-comment-display',
  standalone: true,
  imports: [MatIcon, MatMiniFabButton, MatCardModule, MatTooltipModule],
  templateUrl: './comment-display.component.html',
  styleUrl: './comment-display.component.scss',
})
export class CommentDisplayComponent {
  private postService = inject(PostsService);
  private dialog = inject(MatDialog);

  comments = input<Comment[]>([]);

  onRemoveComment(postId: number, commentId: number) {
    this.postService.removeCommentFromPost(postId, commentId);
  }

  onUpdateComment(postId: number, comment: Comment) {
    const dialogRef = this.dialog.open(CommentFormDialogComponent, {
      data: { postId, comment },
      width: '50%',
      height: 'fit-content',
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((result: Comment) => {
          if (result) {
            this.postService.updateCommentForPost(postId, result);
          }
        })
      )
      .subscribe();
  }
}
