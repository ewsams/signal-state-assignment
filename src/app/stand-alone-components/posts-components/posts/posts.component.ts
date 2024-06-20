import { Component, OnInit, effect, signal, viewChild } from '@angular/core';
import { Comment } from '../../../models/Comment.model';
import { PostsService } from '../../../services/posts.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommentDisplayComponent } from '../../comment-components/comment-display/comment-display.component';
import { tap } from 'rxjs/operators';
import { CommentFormDialogComponent } from '../../comment-components/comment-form-dialog/comment-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PostsFormDialogComponent } from '../posts-form-dialog/posts-form-dialog.component';
import { Post } from '../../../models/Post.models';

@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [PostsService],
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    DatePipe,
    JsonPipe,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    CommentDisplayComponent,
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  paginator = viewChild.required(MatPaginator);
  dataSource = new MatTableDataSource<Post>([]);

  posts = this.postsService.posts;
  isLoading = this.postsService.isLoading;
  error = this.postsService.error;
  currentState = this.postsService.currentState;
  showState = signal(false);

  displayedColumns = [
    'title',
    'body',
    'comments',
    'authorName',
    'authorEmail',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  constructor(
    protected readonly postsService: PostsService,
    private dialog: MatDialog
  ) {
    effect(() => {
      this.dataSource.data = this.posts();
      this.dataSource.paginator = this.paginator();
    });
  }

  ngOnInit() {
    this.postsService.loadPosts();
  }

  addPost() {
    const dialogRef = this.dialog.open(PostsFormDialogComponent, {
      width: '70%',
      height: '70%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((result: Post) => {
          if (result) {
            this.postsService.addPost(result);
          }
        })
      )
      .subscribe();
  }

  updatePost(post: Post) {
    const dialogRef = this.dialog.open(PostsFormDialogComponent, {
      data: { post },
      width: '70%',
      height: '70%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((result: Post) => {
          if (result) {
            this.postsService.updatePost(result);
          }
        })
      )
      .subscribe();
  }

  deletePost(postId: number) {
    this.postsService.removePost(postId);
  }

  addComment(postId: number) {
    const dialogRef = this.dialog.open(CommentFormDialogComponent, {
      data: { postId },
      width: '60%',
      height: '60%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        tap((result: Comment) => {
          if (result) {
            this.postsService.addCommentToPost(postId, result);
          }
        })
      )
      .subscribe();
  }

  toggleShowState() {
    this.showState.set(!this.showState());
  }
}
