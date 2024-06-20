import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/Post.models';
import { Comment } from '../models/Comment.model';
import { processPosts } from '../helpers/posts-helper-methods';
import { PostsState } from '../models/PostsState.type';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { patchState, signalState } from '@ngrx/signals';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com';

  private readonly postsState = signalState<PostsState>({
    posts: [],
    isLoading: false,
    error: null,
  });

  readonly posts = this.postsState.posts;
  readonly isLoading = this.postsState.isLoading;
  readonly error = this.postsState.error;
  readonly currentState = this.postsState;

  private async fetchPosts() {
    return firstValueFrom(this.http.get<Post[]>(`${this.apiUrl}/posts`));
  }

  async loadPosts() {
    patchState(this.postsState, { isLoading: true });
    try {
      const posts = await this.fetchPosts();
      const processedPosts = processPosts(posts);
      patchState(this.postsState, { posts: processedPosts, isLoading: false });
    } catch (error) {
      patchState(this.postsState, { error, isLoading: false });
    }
  }

  updatePost(updatedPost: Post) {
    patchState(this.postsState, {
      posts: this.postsState().posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    });
  }

  addCommentToPost(postId: number, comment: Comment) {
    patchState(this.postsState, {
      posts: this.postsState().posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments ?? []), comment] }
          : post
      ),
    });
  }

  removeCommentFromPost(postId: number, commentId: number) {
    patchState(this.postsState, {
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
      posts: [post, ...this.postsState().posts],
    });
  }

  removePost(postId: number) {
    patchState(this.postsState, {
      posts: this.postsState().posts.filter((post) => post.id !== postId),
    });
  }
}
