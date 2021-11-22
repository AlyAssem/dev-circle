import React from 'react';

interface IPost {
  title: string;
  content: string;
  author: string;
  publishedDate: string;
}

const Post: React.FC<IPost> = ({ title, content, author, publishedDate }) => (
  <div className='post_card'>
    <div className='flex flex-col h-full justify-between'>
      <div className='p-3 '>
        <div className='text-gray-900 font-bold text-xl mb-2'>{title}</div>
        <p className='text-gray-700 text-base'>{content}</p>
      </div>

      <div className='p-4'>
        <span className='block text-green-600 font-medium'>{author},</span>
        <span className='text-gray-600'>{publishedDate}</span>
      </div>
    </div>
  </div>
);

export default Post;
