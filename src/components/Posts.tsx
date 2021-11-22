import React from 'react';
import Post from './Post';

interface IPosts {
  posts: Array<{
    title: string;
    content: string;
    author: string;
    publishedDate: string;
  }>;
}
const Posts: React.FC<IPosts> = ({ posts }) => (
  <div>
    {posts.map((item, idx) => (
      <Post
        key={idx.toString()}
        title={item.title}
        content={item.content}
        author={item.author}
        publishedDate={item.publishedDate}
      />
    ))}
  </div>
);

export default Posts;
