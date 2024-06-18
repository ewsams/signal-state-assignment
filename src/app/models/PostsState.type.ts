import { Post } from './Post.models';

export type PostsState = {
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
