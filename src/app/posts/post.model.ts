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
}

export interface Comment {
  id: string;
  comment: string;
  commentatorId: string;
  commentator: string;
  createdAt: Date;
}
