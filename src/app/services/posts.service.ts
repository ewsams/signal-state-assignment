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
} from '../helpers/posts-helper-methods';
import { PostsState } from '../models/PostsState.type';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com';

  private readonly postsState = signalState<PostsState>({
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

  readonly posts = this.postsState.posts;
  readonly comments = this.postsState.comments;
  readonly isLoading = this.postsState.isLoading;
  readonly error = this.postsState.error;
  readonly currentState = this.postsState;

  loadPosts() {
    patchState(this.postsState, {
      ...this.postsState(),
      isLoading: true,
      posts: [],
    });
    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        tap((posts) => {
          const processedPosts = this.processPosts(posts);
          patchState(this.postsState, {
            ...this.postsState(),
            posts: processedPosts,
            isLoading: false,
          });
        }),
        catchError((error) => {
          patchState(this.postsState, {
            ...this.postsState(),
            error: error.message,
            isLoading: false,
          });
          return EMPTY;
        })
      )
      .subscribe();
  }

  updatePost(updatedPost: Post) {
    patchState(this.postsState, {
      ...this.postsState(),
      posts: this.postsState().posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    });
  }

  addCommentToPost(postId: number, comment: Comment) {
    patchState(this.postsState, {
      ...this.postsState(),
      posts: this.postsState().posts.map((post) =>
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
    patchState(this.postsState, {
      ...this.postsState(),
      posts: this.postsState().posts.map((post) =>
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
    patchState(this.postsState, {
      ...this.postsState(),
      posts: this.postsState().posts.map((post) =>
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
    patchState(this.postsState, {
      ...this.postsState(),
      posts: [post, ...this.postsState().posts],
    });
  }

  removePost(postId: number) {
    patchState(this.postsState, {
      ...this.postsState(),
      posts: this.postsState().posts.filter((post) => post.id !== postId),
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
