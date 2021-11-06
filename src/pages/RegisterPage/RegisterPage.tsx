import React, { useState } from 'react';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uuid } from 'uuidv4';
import * as Yup from 'yup';

import { useAppDispatch } from '../../redux-features/hooks';
import { registerUser } from '../../redux-features/users';
import Eye from '../../icons/Eye';
import EyeOff from '../../icons/EyeOff';

export const RegisterPage: React.FC = () => {
  const [state, setState] = useState({
    shouldShowPassword: false,
    shouldShowConfirmPassword: false,
  });
  const dispatch = useAppDispatch();

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
    onSubmit: async (values, { resetForm }) => {
      const resultAction = await dispatch(
        registerUser({
          id: uuid(),
          email: values.email,
          userName: values.userName,
          password: values.password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        // user will have a type signature of User as we passed that as the Returned parameter in createAsyncThunk
        const user = resultAction.payload;
        toast.success(
          <div>
            Success
            <br />
            <span>Registered: {user.userName}</span>
          </div>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      }

      if (registerUser.rejected.match(resultAction)) {
        if (resultAction.payload) {
          // if the error is sent from server payload
          toast.error(
            <div>
              Error
              <br />
              {resultAction.payload.errorMessage}
            </div>,

            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        } else {
          toast.error(
            <div>
              Error
              <br />
              {resultAction.error}
            </div>,
            {
              position: toast.POSITION.BOTTOM_RIGHT,
            }
          );
        }
      }

      resetForm();
    },
  });

  const handleShowPasswordToggle = () => {
    setState((currState) => ({
      ...currState,
      shouldShowPassword: !currState.shouldShowPassword,
    }));
  };

  const handleShowConfirmPasswordToggle = () => {
    setState((currState) => ({
      ...currState,
      shouldShowConfirmPassword: !currState.shouldShowConfirmPassword,
    }));
  };

  return (
    <div className='pt-24 pb-6 min-h-screen bg-gray-100 '>
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

          <div className='mb-3 pt-3 rounded bg-gray-200 relative'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='password'
            >
              Password
            </label>
            <input
              id='password'
              type={state.shouldShowPassword ? 'text' : 'password'}
              className='auth-card__input'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type='button'
              className='text-green-600 absolute right-3'
              onClick={handleShowPasswordToggle}
            >
              {state.shouldShowPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className='text-red-500 mb-3'>{formik.errors.password}</div>
          ) : null}

          <div className='mb-3 pt-3 rounded bg-gray-200 relative'>
            <label
              className='block text-gray-700 text-sm font-bold mb-2 ml-3'
              htmlFor='confirmPassword'
            >
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type={state.shouldShowConfirmPassword ? 'text' : 'password'}
              className='auth-card__input'
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type='button'
              className='text-green-600 absolute right-3'
              onClick={handleShowConfirmPasswordToggle}
            >
              {state.shouldShowConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
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
      <div className='max-w-lg mx-auto text-center mt-12 mb-6'>
        <p>
          Already a member? &nbsp;
          <a href='/login' className='font-bold text-green-700 hover:underline'>
            Sign In
          </a>
          .
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};
