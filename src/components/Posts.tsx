import React from 'react';
import Post from './Post';

interface IPosts {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    postUserInfo: {
      id: string;
      userName: string;
    };
  }>;
}
const Posts: React.FC<IPosts> = ({ posts }) => (
  <>
    {posts.map((item, idx) => (
      <Post
        id={item.id}
        key={idx.toString()}
        title={item.title}
        content={item.content}
        postUserInfo={item.postUserInfo}
      />
    ))}
  </>
);

export default Posts;
