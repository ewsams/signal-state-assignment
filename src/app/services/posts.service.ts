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
    this.updateState({ isLoading: true, posts: [] });
    return this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        tap((posts) => {
          const processedPosts = this.processPosts(posts);
          this.updateState({ posts: processedPosts, isLoading: false });
        }),
        catchError((error) => {
          this.updateState({ error: error.message, isLoading: false });
          return EMPTY;
        })
      )
      .subscribe();
  }

  updatePost(updatedPost: Post) {
    this.modifyState((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    }));
  }

  addCommentToPost(postId: number, comment: Comment) {
    this.modifyState((state) => {
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const updatedPost = {
          ...post,
          comments: [...(post.comments ?? []), comment],
        };
        return {
          posts: state.posts.map((post) =>
            post.id === postId ? updatedPost : post
          ),
        };
      }
      return state;
    });
  }

  removeCommentFromPost(postId: number, commentId: number) {
    this.modifyState((state) => {
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const updatedPost = {
          ...post,
          comments: (post.comments ?? []).filter(
            (comment) => comment.id !== commentId
          ),
        };
        return {
          posts: state.posts.map((post) =>
            post.id === postId ? updatedPost : post
          ),
        };
      }
      return state;
    });
  }

  updateCommentForPost(postId: number, updatedComment: Comment) {
    this.modifyState((state) => {
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        const updatedPost = {
          ...post,
          comments: (post.comments ?? []).map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
          ),
        };
        return {
          posts: state.posts.map((post) =>
            post.id === postId ? updatedPost : post
          ),
        };
      }
      return state;
    });
  }

  addPost(post: Post) {
    this.modifyState((state) => ({
      posts: [post, ...state.posts],
    }));
  }

  removePost(postId: number) {
    this.modifyState((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    }));
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

  /**
   * Directly update the state with a new partial state object.
   * @param newState - The new partial state to apply.
   */
  private updateState(newState: Partial<PostsState>) {
    patchState(this.state, { ...this.state(), ...newState });
  }
  /**
   * Modify the state based on a function that returns a partial state.
   * @param patchFn - A function that takes the current state and returns a partial state.
   */
  private modifyState(patchFn: (state: PostsState) => Partial<PostsState>) {
    patchState(this.state, { ...this.state(), ...patchFn(this.state()) });
  }
}
