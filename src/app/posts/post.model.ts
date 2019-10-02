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
  _id: string;
  comment: string;
  commentatorId: string;
  commentator: string;
  createdAt: Date;
}

export function sortPosts(c1: Post, c2: Post) {

  // const compare = c1.seqNo - c2.seqNo;
  const post1 = c1.id;
  const post2 = c2.id;

  if (post1 > post2) {
    return -1;
  } else if ( post1 < post2) {
    return 1;
  } else {
    return 0;
  }

}
