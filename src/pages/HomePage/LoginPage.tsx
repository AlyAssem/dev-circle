import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const LoginPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className='pt-36 min-h-screen bg-gray-100'>
      <header className='max-w-lg mx-auto'>
        <div className='text-4xl font-bold text-green-500 text-center'>
          DevCircle
        </div>
      </header>
      <div className='login-card'>
        <section className='mb-3'>
          <h3 className='font-bold text-2xl'>Welcome to DevCircle</h3>
          <p className='text-gray-600 pt-2'>Sign in to your account.</p>
        </section>

        <form className='flex flex-col' onSubmit={formik.handleSubmit}>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='email'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              className='login-card__input'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.email && formik.errors.email ? (
            <div className='text-red-500 mb-3'>{formik.errors.email}</div>
          ) : null}

          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='password'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              className='login-card__input'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className='text-red-500 mb-3'>{formik.errors.password}</div>
          ) : null}
          <div className='flex justify-between items-center'>
            <a
              href=' '
              className='text-sm text-green-600 hover:text-green-700 hover:underline'
            >
              Forgot your password?
            </a>
            <button className='login-card__submit-btn' type='submit'>
              Sign In
            </button>
          </div>
        </form>
      </div>
      <div className='max-w-lg mx-auto text-center mt-12 mb-6'>
        <p>
          Don&apos;t have an account? &nbsp;
          <a href=' ' className='font-bold text-green-700 hover:underline'>
            Sign Up
          </a>
          .
        </p>
      </div>
    </div>
  );
};