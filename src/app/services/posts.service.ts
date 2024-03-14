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

  private readonly state = signalState<PostsState>({
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
          const updatedPosts = posts.map((post) => ({
            ...post,
            author: {
              name: this.generateRandomName(),
              email: this.generateRandomEmail(),
            },
            metadata: {
              createdAt: this.generateRandomDate(),
              updatedAt: '',
            },
          }));
          this.setPosts(updatedPosts);
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
    const postWithMetadata: Post = {
      ...post,
      author: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    return this.http
      .post<Post>(`${this.apiUrl}/posts`, postWithMetadata)
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
    const postWithMetadata: Post = {
      ...post,
      author: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      metadata: {
        createdAt: post.metadata.createdAt,
        updatedAt: Date.now().toString(),
      },
    };
    return this.http
      .put<Post>(`${this.apiUrl}/posts/${postId}`, postWithMetadata)
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

  private generateRandomName(): string {
    const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Williams'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateRandomEmail(): string {
    const domains = ['example.com', 'test.com', 'demo.com'];
    const randomString = Math.random().toString(36).substring(7);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${randomString}@${domain}`;
  }

  private generateRandomDate(): string {
    const start = new Date(2022, 0, 1);
    const end = new Date();
    const randomTimestamp =
      start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTimestamp);
    return randomDate.toISOString();
  }

  generateRandomSentence(wordCount: number): string {
    const words = ['post', 'new', 'color', 'open', 'apple'];
    return Array.from(
      { length: wordCount },
      () => words[Math.floor(Math.random() * words.length)]
    ).join(' ');
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
