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
  likesCount: number;
  commentsCount: number;
}

export interface IComment {
  id: string;
  user: Partial<IUser>;
  text: string;
  createdAt: string;
}
