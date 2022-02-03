import React from 'react';

const Loader: React.FC = () => (
  <div className='bg-black bg-opacity-20 fixed inset-0 flex justify-center items-center'>
    <div className='bg-gray-200 p-5 rounded-full flex space-x-3'>
      <div
        className='w-5 h-5 bg-gray-800 rounded-full animate-bounce'
        style={{ animationDelay: '0.1s' }}
      />
      <div
        className='w-5 h-5 bg-gray-800 rounded-full animate-bounce'
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className='w-5 h-5 bg-gray-800 rounded-full animate-bounce'
        style={{ animationDelay: '0.3s' }}
      />
    </div>
  </div>
);

export default Loader;
