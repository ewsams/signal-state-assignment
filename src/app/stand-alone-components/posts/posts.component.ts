import { Component, OnInit, effect, signal, viewChild } from '@angular/core';
import { Post } from '../../models/Post.models';
import { Comment } from '../../models/Comment.model';
import { PostsService } from '../../services/posts.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  generateRandomEmail,
  generateRandomName,
  generateRandomSentence,
} from '../../helpers/posts-helper-methods';
import { CommentDisplayComponent } from '../comment-display/comment-display.component';
import { tap } from 'rxjs/operators';
import { CommentFormDialogComponent } from '../comment-form-dialog/comment-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    const id = Math.floor(Math.random() * 1000);
    const newPost: Post = {
      userId: 1,
      id,
      title: `New Post ID: #${id} ${generateRandomSentence(10)}`,
      body: `This is a new post ${generateRandomSentence(10)} it's ID is ${id}`,
      author: {
        name: generateRandomName(),
        email: generateRandomEmail(),
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: '',
      },
      comments: [],
    };

    this.postsService.addPost(newPost);
  }

  updatePost(post: Post) {
    const updatedPost: Post = {
      ...post,
      author: {
        name: generateRandomName(),
        email: generateRandomEmail(),
      },
      title: `Updated Title ID: ${post.id} ${generateRandomSentence(10)}`,
      body: `Updated Body ID: ${post.id} ${generateRandomSentence(20)}`,
      metadata: {
        ...post.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    this.postsService.updatePost(updatedPost);
  }

  deletePost(postId: number) {
    this.postsService.removePost(postId);
  }

  addComment(postId: number) {
    const dialogRef = this.dialog.open(CommentFormDialogComponent, {
      data: { postId },
      width: '60vw',
      height: '60vh',
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
