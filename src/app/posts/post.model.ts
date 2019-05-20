import { AuthData } from './../auth/auth.model';
export interface Post {
  id: string;
  post: string;
  username: string;
  created_at: Date;
  imagePath?: string;
  comments?: Comment[];
  creatorId?: string;
  creator?: string;
  created?: number;
  likedBy: string[];
  dislikedBy: string[];
}

export interface Comment {
  _id: string;
  comment: string;
  commentatorId: string;
  commentator: string;
  createdAt: Date;
}
