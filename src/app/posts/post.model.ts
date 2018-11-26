export interface Post {
  id: string;
  post: string;
  username: string;
  created_at: Date;
  imagePath?: string;
  comments?: string[];
  creatorId?: string;
  creator?: string;
  created?: number;
}
