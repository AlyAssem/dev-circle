export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  likedPosts?: Array<string>;
  notifications?: Array<INotification>;
}

export interface INotification {
  id: number;
  sender: Partial<IUser>;
  post: Partial<IPost>;
  recipientId: string;
  type: string;
  read: boolean;
  created_at: Date;
}

export interface IPost {
  id: string;
  user: Partial<IUser>;
  title: string;
  content: string;
  comments: Array<IComment>;
  comment_count: number;
  like_count: number;
}

export interface IComment {
  id: number;
  user: Partial<IUser>;
  post: Partial<IPost>;
  text: string;
  createdAt: string;
}
