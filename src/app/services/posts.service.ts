import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signalState, patchState } from '@ngrx/signals';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { Post } from '../models/Post.models';
import { Comment } from '../models/Comment.model'; // Ensure correct import
import {
  generateRandomDate,
  generateRandomEmail,
  generateRandomName,
  generateRandomSentence,
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
    isLoading: false,
    comments: [],
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

  readonly posts = computed(() => this.state().posts);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

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

  getPostById(postId: number) {
    this.setLoadingState(true);
    return this.http
      .get<Post>(`${this.apiUrl}/posts/${postId}`)
      .pipe(
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        }),
        finalize(() => this.setLoadingState(false))
      )
      .subscribe();
  }

  getPostComments(postId: number) {
    this.setLoadingState(true);
    return this.http
      .get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`)
      .pipe(
        tap((comments) => {
          this.updateCommentsInPost(postId, comments);
          this.setLoadingState(false);
        }),
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  addNewPost(post: Post) {
    this.setLoadingState(true);
    const postWithMetadata: Post = {
      ...post,
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
    return this.http
      .post<Post>(`${this.apiUrl}/posts`, postWithMetadata)
      .pipe(
        tap((createdPost) => {
          this.addPostToState(createdPost);
          this.setLoadingState(false);
        }),
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updatePost(postId: number, post: Post) {
    this.setLoadingState(true);
    const postWithMetadata: Post = {
      ...post,
      body: generateRandomSentence(40),
      metadata: {
        createdAt: post.metadata.createdAt,
        updatedAt: new Date().toISOString(),
      },
    };
    return this.http
      .put<Post>(`${this.apiUrl}/posts/${postId}`, postWithMetadata)
      .pipe(
        tap((updatedPost) => {
          this.updatePostInState(updatedPost);
          this.setLoadingState(false);
        }),
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  deletePost(postId: number) {
    this.setLoadingState(true);
    return this.http
      .delete<void>(`${this.apiUrl}/posts/${postId}`)
      .pipe(
        tap(() => {
          this.removePostFromState(postId);
          this.setLoadingState(false);
        }),
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  loadCommentsForPost(postId: number) {
    this.setLoadingState(true);
    return this.http
      .get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`)
      .pipe(
        tap((comments) => {
          this.updateCommentsInPost(postId, comments);
          this.setLoadingState(false);
        }),
        catchError((error) => {
          this.setErrorState(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private updateCommentsInPost(postId: number, comments: Comment[]): void {
    patchState(this.state, (state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, comments } : post
      ),
    }));
  }

  addCommentToPost(postId: number, comment: Comment) {
    return this.http
      .post<Comment>(`${this.apiUrl}/posts/${postId}/comments`, comment)
      .pipe(
        tap((newComment) => {
          this.updateCommentsInPost(postId, [
            ...(this.state().posts.find((post) => post.id === postId)
              ?.comments || []),
            newComment,
          ]);
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

  private addPostToState(post: Post): void {
    patchState(this.state, (state) => ({
      posts: [post, ...state.posts],
    }));
  }

  private updatePostInState(updatedPost: Post): void {
    patchState(this.state, (state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    }));
  }

  private removePostFromState(postId: number): void {
    patchState(this.state, (state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  }

  private setComments(comments: Comment[]): void {
    patchState(this.state, { comments });
  }

  private setLoadingState(isLoading: boolean): void {
    patchState(this.state, { isLoading });
  }

  private setErrorState(error: string | null): void {
    patchState(this.state, { error });
  }
}
