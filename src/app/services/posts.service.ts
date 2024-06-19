import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signalState, patchState } from '@ngrx/signals';
import { catchError, EMPTY, tap } from 'rxjs';
import { Post } from '../models/Post.models';
import { Comment } from '../models/Comment.model';
import {
  generateRandomDate,
  generateRandomEmail,
  generateRandomName,
  generateRandomSentence,
} from './posts-service-helper-methods';
import { PostsState } from '../models/PostsState.type';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com';

  readonly state = signalState<PostsState>({
    posts: [],
    comments: [],
    isLoading: false,
    error: null,
    author: {
      name: null,
      email: null,
    },
    metadata: {
      createdAt: null,
      updatedAt: null,
    },
  });

  readonly posts = this.state.posts;
  readonly comments = this.state.comments;
  readonly isLoading = this.state.isLoading;
  readonly error = this.state.error;
  readonly currentState = this.state;

  loadPosts() {
    patchState(this.state, { ...this.state(), isLoading: true, posts: [] });
    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        tap((posts) => {
          const processedPosts = this.processPosts(posts);
          patchState(this.state, {
            ...this.state(),
            posts: processedPosts,
            isLoading: false,
          });
        }),
        catchError((error) => {
          patchState(this.state, {
            ...this.state(),
            error: error.message,
            isLoading: false,
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  updatePost(updatedPost: Post) {
    patchState(this.state, {
      ...this.state(),
      posts: this.state().posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    });
  }

  addCommentToPost(postId: number, comment: Comment) {
    patchState(this.state, {
      ...this.state(),
      posts: this.state().posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments ?? []), comment],
            }
          : post
      ),
    });
  }

  removeCommentFromPost(postId: number, commentId: number) {
    patchState(this.state, {
      ...this.state(),
      posts: this.state().posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments ?? []).filter(
                (comment) => comment.id !== commentId
              ),
            }
          : post
      ),
    });
  }

  updateCommentForPost(postId: number, updatedComment: Comment) {
    patchState(this.state, {
      ...this.state(),
      posts: this.state().posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments ?? []).map((comment) =>
                comment.id === updatedComment.id ? updatedComment : comment
              ),
            }
          : post
      ),
    });
  }

  addPost(post: Post) {
    patchState(this.state, {
      ...this.state(),
      posts: [post, ...this.state().posts],
    });
  }

  removePost(postId: number) {
    patchState(this.state, {
      ...this.state(),
      posts: this.state().posts.filter((post) => post.id !== postId),
    });
  }

  private processPosts(posts: Post[]): Post[] {
    return posts.slice(0, 10).map((post) => ({
      ...post,
      body: generateRandomSentence(10),
      author: {
        name: generateRandomName(),
        email: generateRandomEmail(),
      },
      metadata: {
        createdAt: generateRandomDate(),
        updatedAt: '',
      },
      comments: [],
    }));
  }
}
