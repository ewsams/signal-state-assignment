import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signalState, patchState } from '@ngrx/signals';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { Post } from '../models/Post.models';

type PostsState = {
  posts: Post[];
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
};

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com';

  private readonly state = signalState<PostsState>({
    posts: [],
    comments: [],
    isLoading: false,
    error: null,
  });

  readonly posts = computed(() => this.state().posts);
  readonly comments = computed(() => this.state().comments);
  readonly isLoading = computed(() => this.state().isLoading);
  readonly error = computed(() => this.state().error);

  loadPosts() {
    this.setLoading(true);
    this.setPosts([]);
    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        tap((posts) => {
          this.setPosts(posts);
          this.setLoading(false);
        }),
        catchError((error) => {
          this.setError(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  getPostById(postId: number) {
    this.setLoading(true);
    return this.http
      .get<Post>(`${this.apiUrl}/posts/${postId}`)
      .pipe(
        catchError((error) => {
          this.setError(error.message);
          return EMPTY;
        }),
        finalize(() => this.setLoading(false))
      )
      .subscribe();
  }

  getPostComments(postId: number) {
    this.setLoading(true);
    return this.http
      .get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`)
      .pipe(
        tap((comments) => {
          this.setComments(comments);
          this.setLoading(false);
        }),
        catchError((error) => {
          this.setError(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  createPost(post: Post) {
    this.setLoading(true);
    return this.http
      .post<Post>(`${this.apiUrl}/posts`, post)
      .pipe(
        tap((createdPost) => {
          this.addPost(createdPost);
          this.setLoading(false);
        }),
        catchError((error) => {
          this.setError(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  updatePost(postId: number, post: Post) {
    this.setLoading(true);
    return this.http
      .put<Post>(`${this.apiUrl}/posts/${postId}`, post)
      .pipe(
        tap((updatedPost) => {
          this.updatePostInState(updatedPost);
          this.setLoading(false);
        }),
        catchError((error) => {
          this.setError(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  deletePost(postId: number) {
    this.setLoading(true);
    return this.http
      .delete<void>(`${this.apiUrl}/posts/${postId}`)
      .pipe(
        tap(() => {
          this.removePostFromState(postId);
          this.setLoading(false);
        }),
        catchError((error) => {
          this.setError(error.message);
          return EMPTY;
        })
      )
      .subscribe();
  }

  private setPosts(posts: Post[]): void {
    patchState(this.state, { posts });
  }

  private addPost(post: Post): void {
    patchState(this.state, (state) => ({
      posts: [...state.posts, post],
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

  private setLoading(isLoading: boolean): void {
    patchState(this.state, { isLoading });
  }

  private setError(error: string | null): void {
    patchState(this.state, { error });
  }
}
