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
  readonly isError = this.state.error;
  readonly currentState = this.state;

  loadPosts() {
    this.setState({ isLoading: true, posts: [] });
    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        tap((posts) => this.processPosts(posts)),
        catchError((error) => {
          this.setState({ error: error.message });
          return EMPTY;
        })
      )
      .subscribe();
  }

  private processPosts(posts: Post[]) {
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
    this.setState({ posts: loadedPosts, isLoading: false });
  }

  updatePost(updatedPost: Post) {
    this.patchState((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    }));
  }

  addCommentToPost(postId: number, comment: Comment) {
    this.patchState((state) => {
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const updatedPost = {
          ...post,
          comments: [...(post.comments || []), comment],
        };
        return {
          posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        };
      }
      return {};
    });
  }

  addPost(post: Post) {
    this.patchState((state) => ({
      posts: [post, ...state.posts],
    }));
  }

  removePost(postId: number) {
    this.patchState((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
  }

  private setState(newState: Partial<PostsState>) {
    patchState(this.state, newState);
  }

  private patchState(patchFn: (state: PostsState) => Partial<PostsState>) {
    patchState(this.state, patchFn(this.state()));
  }
}
