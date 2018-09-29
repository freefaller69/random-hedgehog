export interface Post {
  id: string;
  post: string;
  username: string;
  createdAt: number;
  imagePath?: string;
  comments?: string[];
  creator?: string;
  created?: number;
}
