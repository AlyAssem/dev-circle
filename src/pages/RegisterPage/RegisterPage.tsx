import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const RegisterPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: (values, { resetForm }) => {
      fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      resetForm();
    },
  });
  return (
    <div className='pt-36 min-h-screen bg-gray-100'>
      <header className='max-w-lg mx-auto'>
        <div className='text-4xl font-bold text-green-500 text-center'>
          DevCircle
        </div>
      </header>
      <div className='auth-card'>
        <section className='mb-3'>
          <h3 className='font-bold text-2xl'>Welcome to DevCircle</h3>
          <p className='text-gray-600 pt-2'>Sign up to your account.</p>
        </section>

        <form className='flex flex-col' onSubmit={formik.handleSubmit}>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='userName'
            >
              User Name
            </label>
            <input
              id='userName'
              type='text'
              className='auth-card__input'
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.userName && formik.errors.userName ? (
            <div className='text-red-500 mb-3'>{formik.errors.userName}</div>
          ) : null}
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
              className='auth-card__input'
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
              className='auth-card__input'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className='text-red-500 mb-3'>{formik.errors.password}</div>
          ) : null}

          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='confirmPassword'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              className='auth-card__input'
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className='text-red-500 mb-3'>
              {formik.errors.confirmPassword}
            </div>
          ) : null}
          <div className='flex justify-center items-center'>
            <button className='auth-card__submit-btn' type='submit'>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};