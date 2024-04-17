import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  effect,
} from '@angular/core';
import { Post } from '../../models/Post.models';
import { PostsService } from '../../services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { generateRandomSentence } from '../../services/posts-service-helper-methods';

@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [PostsService],
  imports: [
    HttpClientModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    DatePipe,
  ],
  template: `
    <div class="container">
      <h1>Posts Example Using Signal State</h1>

      @if(postsService.isLoading()){
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      } @if(postsService.error()){
      <div class="error">Error: {{ postsService.error() }}</div>
      }
      <mat-table [dataSource]="dataSource">
        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <mat-header-cell *matHeaderCellDef> Title </mat-header-cell>
          <mat-cell *matCellDef="let post"> {{ post.title }} </mat-cell>
        </ng-container>

        <!-- Body Column -->
        <ng-container matColumnDef="body">
          <mat-header-cell *matHeaderCellDef> Body </mat-header-cell>
          <mat-cell *matCellDef="let post"> {{ post.body }} </mat-cell>
        </ng-container>

        <!-- Author Name Column -->
        <ng-container matColumnDef="authorName">
          <mat-header-cell *matHeaderCellDef> Author Name </mat-header-cell>
          <mat-cell *matCellDef="let post"> {{ post.author?.name }} </mat-cell>
        </ng-container>

        <!-- Author Email Column -->
        <ng-container matColumnDef="authorEmail">
          <mat-header-cell *matHeaderCellDef> Author Email </mat-header-cell>
          <mat-cell *matCellDef="let post"> {{ post.author?.email }} </mat-cell>
        </ng-container>

        <!-- Created At Column -->
        <ng-container matColumnDef="createdAt">
          <mat-header-cell *matHeaderCellDef> Created At </mat-header-cell>
          <mat-cell *matCellDef="let post">
            {{ post.metadata?.createdAt | date : 'medium' }}
          </mat-cell>
        </ng-container>

        <!-- Updated At Column -->
        <ng-container matColumnDef="updatedAt">
          <mat-header-cell *matHeaderCellDef> Updated At </mat-header-cell>
          <mat-cell *matCellDef="let post">
            {{ post.metadata?.updatedAt | date : 'medium' }}
          </mat-cell>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
          <mat-cell *matCellDef="let post">
            <button mat-button (click)="updatePost(post)">Update</button>
            <button mat-button color="warn" (click)="deletePost(post.id)">
              Delete
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      </mat-table>

      <mat-paginator
        [pageSize]="5"
        [pageSizeOptions]="[5, 10, 20]"
      ></mat-paginator>

      <div class="actions">
        <button
          mat-raised-button
          color="primary"
          (click)="postsService.loadPosts()"
        >
          Load New Posts
        </button>
        <button mat-raised-button color="accent" (click)="addPost()">
          Add New Post
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        padding: 2rem;
        .actions {
          display: inherit;
          gap: 1rem;
          justify-content: center;
        }
      }
    `,
  ],
})
export class PostsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = [
    'title',
    'body',
    'authorName',
    'authorEmail',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Post>([]);

  constructor(protected readonly postsService: PostsService) {
    effect(() => {
      this.dataSource.data = this.postsService.posts();
    });
  }

  ngOnInit(): void {
    this.postsService.loadPosts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  addPost(): void {
    const id = Math.floor(Math.random() * 1000);
    const newPost: Post = {
      userId: 1,
      id,
      title: `New Post ID: #${id} ${generateRandomSentence(10)}`,
      body: `This is a new post ${generateRandomSentence(30)} it's ID is ${id}`,
      author: {
        name: '',
        email: '',
      },
      metadata: {
        createdAt: '',
        updatedAt: '',
      },
    };

    this.postsService.addNewPost(newPost);
  }

  updatePost(post: Post): void {
    const randomTitle = `Updated Title ID: ${post.id} ${generateRandomSentence(
      10
    )}`;
    const randomBody = `Updated Body ID: ${post.id} ${generateRandomSentence(
      30
    )}`;
    this.postsService.updatePost(post.id, post);
  }

  deletePost(postId: number): void {
    this.postsService.deletePost(postId);
  }
}
