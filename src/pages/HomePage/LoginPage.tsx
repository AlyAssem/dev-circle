import React from 'react';

export const LoginPage: React.FC = () => (
  <div className='pt-36 min-h-screen bg-gray-100'>
    <header className='max-w-lg mx-auto'>
      <div className='text-4xl font-bold text-green-500 text-center'>
        DevCircle
      </div>
    </header>
    <main className='login-card'>
      <section className='mb-3'>
        <h3 className='font-bold text-2xl'>Welcome to DevCircle</h3>
        <p className='text-gray-600 pt-2'>Sign in to your account.</p>
      </section>
      <form className='flex flex-col'>
        <div className='mb-6 pt-3 rounded bg-gray-200'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 ml-3'
            htmlFor='email'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            className='bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3'
          />
        </div>

        <div className='mb-6 pt-3 rounded bg-gray-200'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 ml-3'
            htmlFor='password'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            className='bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3'
          />
        </div>
        <div className='flex justify-between items-center'>
          <a
            href=' '
            className='text-sm text-green-600 hover:text-green-700 hover:underline'
          >
            Forgot your password?
          </a>
          <button
            className='px-2 object-contain bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200'
            type='submit'
          >
            Sign In
          </button>
        </div>
      </form>
    </main>
    <div className='max-w-lg mx-auto text-center mt-12 mb-6'>
      <p className='text-green-700'>
        Dont have an account? &nbsp;
        <a href=' ' className='font-bold hover:underline'>
          Sign up
        </a>
        .
      </p>
    </div>
  </div>
);
