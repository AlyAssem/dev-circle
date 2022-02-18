export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  likedPosts?: Array<ILikeObj>;
}

export interface ILikeObj {
  userId: string;
  postId: string;
}

export interface IPost {
  id: string;
  user: Partial<IUser>;
  title: string;
  content: string;
  like_count: number;
  comment_count: number;
}

export interface IComment {
  id: number;
  user: Partial<IUser>;
  post: Partial<IPost>;
  text: string;
  createdAt: string;
}
