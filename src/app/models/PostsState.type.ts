import { Post } from './Post.models';

export type PostsState = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
};
