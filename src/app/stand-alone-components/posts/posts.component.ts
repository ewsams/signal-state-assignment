import { AfterViewInit, Component, ViewChild, effect } from '@angular/core';
import { Post } from '../../models/Post.models';
import { PostsService } from '../../services/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { toSignal } from '@angular/core/rxjs-interop';

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

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
          <mat-cell *matCellDef="let post">
            <button mat-button (click)="updatePost(post.id)">Update</button>
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
          Load Posts
        </button>
        <button mat-raised-button color="accent" (click)="createPost()">
          Create Post
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
export class PostsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns = ['title', 'body', 'actions'];
  dataSource = new MatTableDataSource<Post>([]);
  currentlyLoadedPosts = toSignal(this.postsService.loadPosts());

  constructor(public readonly postsService: PostsService) {
    effect(() => {
      this.dataSource.data = this.currentlyLoadedPosts() as Post[];
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  createPost(): void {
    const id = Math.floor(Math.random() * 1000);
    const newPost: Post = {
      userId: 1,
      id,
      title: `New Post ID: #${id} ${this.generateRandomSentence(3)}`,
      body: `This is a new post ${this.generateRandomSentence(
        10
      )} it's ID is ${id}`,
    };

    this.postsService.createPost(newPost);

    this.dataSource.data = [newPost, ...this.dataSource.data];
  }

  updatePost(id: number): void {
    const randomTitle = `Updated Title ${this.generateRandomSentence(3)}`;
    const randomBody = `Updated Body ${this.generateRandomSentence(10)}`;
    const updatedPost: Post = {
      userId: 1,
      id,
      title: randomTitle,
      body: randomBody,
    };
    this.postsService.updatePost(id, updatedPost);

    const postIndex = this.dataSource.data.findIndex((post) => post.id === id);

    this.dataSource.data.splice(postIndex, 1, updatedPost);
  }

  deletePost(postId: number): void {
    this.postsService.deletePost(postId);
    this.dataSource.data = this.dataSource.data.filter(
      (post) => post.id !== postId
    );
  }

  private generateRandomSentence(wordCount: number): string {
    const words = ['post', 'new', 'color', 'open', 'apple'];
    return Array.from(
      { length: wordCount },
      () => words[Math.floor(Math.random() * words.length)]
    ).join(' ');
  }
}
