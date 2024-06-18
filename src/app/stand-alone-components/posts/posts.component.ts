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
import { generateRandomSentence } from '../../services/posts-service-helper-methods';

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
  dataSource = new MatTableDataSource<Post>([]);

  constructor(protected readonly postsService: PostsService) {
    effect(() => {
      untracked(() => {
        this.dataSource.data = this.postsService.posts();
        this.dataSource.paginator = this.paginator();
      });
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

  loadComments(postId: number): void {
    this.postsService.loadCommentsForPost(postId);
  }

  addComment(postId: number): void {
    const newComment: Comment = {
      postId,
      id: Math.floor(Math.random() * 1000),
      name: 'Random Commenter',
      email: 'random@example.com',
      body: 'This is a random comment.',
    };
    this.postsService.addCommentToPost(postId, newComment);
  }
}
