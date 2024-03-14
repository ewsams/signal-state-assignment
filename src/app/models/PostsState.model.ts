import { Post } from './Post.models';

export interface PostsState {
  posts: Post[];
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  selectedPost: {
    post: Post;
    author: {
      name: string;
      email: string;
    };
    metadata: {
      createdAt: string;
      updatedAt: string;
    };
  };
}
