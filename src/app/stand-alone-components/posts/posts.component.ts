import { Component, OnInit, effect, untracked, viewChild } from '@angular/core';
import { Post } from '../../models/Post.models';
import { Comment } from '../../models/Comment.model';
import { PostsService } from '../../services/posts.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe, JsonPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  generateRandomEmail,
  generateRandomName,
  generateRandomSentence,
} from '../../services/posts-service-helper-methods';

@Component({
  selector: 'app-posts',
  standalone: true,
  providers: [PostsService],
  imports: [
    HttpClientModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    DatePipe,
    JsonPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  paginator = viewChild.required(MatPaginator);
  dataSource = new MatTableDataSource<Post>([]);

  post = this.postsService.posts;
  isLoading = this.postsService.isLoading;
  error = this.postsService.error;
  currentState = this.postsService.currentState;
  showState = false;

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

  constructor(protected readonly postsService: PostsService) {
    effect(() => {
      this.dataSource.data = this.post();
      this.dataSource.paginator = this.paginator();
    });
  }

  ngOnInit(): void {
    this.postsService.loadPosts();
  }

  addPost(): void {
    const id = Math.floor(Math.random() * 1000);
    const newPost: Post = {
      userId: 1,
      id,
      title: `New Post ID: #${id} ${generateRandomSentence(10)}`,
      body: `This is a new post ${generateRandomSentence(30)} it's ID is ${id}`,
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

  updatePost(post: Post): void {
    const updatedPost: Post = {
      ...post,
      title: `Updated Title ID: ${post.id} ${generateRandomSentence(10)}`,
      body: `Updated Body ID: ${post.id} ${generateRandomSentence(30)}`,
      metadata: {
        ...post.metadata,
        updatedAt: new Date().toISOString(),
      },
    };
    this.postsService.updatePost(updatedPost);
  }

  deletePost(postId: number): void {
    this.postsService.removePost(postId);
  }

  addComment(postId: number): void {
    const newComment: Comment = {
      postId,
      id: Math.floor(Math.random() * 1000),
      name: generateRandomName(),
      email: generateRandomEmail(),
      body: generateRandomSentence(30),
    };
    this.postsService.addCommentToPost(postId, newComment);
  }
}
