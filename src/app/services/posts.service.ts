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
} from './posts-service-helper-methods';

type PostsState = {
  posts: Post[];
  isLoading: boolean;
  comments: Comment[];
  error: string | null;
  author: {
    name: string | null;
    email: string | null;
  };
  metadata: {
    createdAt: string | null;
    updatedAt: string | null;
  };
};

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
  readonly isError = this.state.error;
  readonly currentState = this.state;

  loadPosts() {
    this.setLoadingState(true);
    this.setPosts([]);
    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        tap((posts) => {
          const loadedPosts = posts.slice(0, 10).map((post) => ({
            ...post,
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
          this.setPosts(loadedPosts);
          this.setLoadingState(false);
        }),
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private setPosts(posts: Post[]): void {
    patchState(this.state, { posts });
  }

  updatePost(updatedPost: Post): void {
    patchState(this.state, (state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    }));
  }

  addCommentToPost(postId: number, comment: Comment): void {
    const post = this.state().posts.find((p) => p.id === postId);
    if (post) {
      const updatedPost = {
        ...post,
        comments: [...(post.comments || []), comment],
      };
      this.updatePost(updatedPost);
    }
  }

  addPost(post: Post): void {
    patchState(this.state, (state) => ({
      posts: [post, ...state.posts],
    }));
  }

  removePost(postId: number): void {
    patchState(this.state, (state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  }

  setLoadingState(isLoading: boolean): void {
    patchState(this.state, { isLoading });
  }

  setErrorState(error: string | null): void {
    patchState(this.state, { error });
  }
}
