import { Comment } from './Comment.model';
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  author: {
    name: string;
    email: string;
  };
  metadata: {
    createdAt: string | null;
    updatedAt: string | null;
  };
  comments?: Comment[];
}
