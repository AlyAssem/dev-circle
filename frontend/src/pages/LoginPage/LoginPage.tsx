/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { History } from 'history';

import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { loginUser } from '../../redux-features/users';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import { ILoginFormValues } from '../../interfaces';

interface ILoginPageProps {
  history: History;
}

export const LoginPage: React.FC<ILoginPageProps> = ({ history }) => {
  const dispatch = useAppDispatch();

  const loggedInUserInfo = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (loggedInUserInfo && Object.keys(loggedInUserInfo).length !== 0) {
      history.push('/');
    }
  }, [history, loggedInUserInfo]);

  const handleFormSubmit = async (values: ILoginFormValues) => {
    const resultAction = await dispatch(
      loginUser({
        email: values.email,
        password: values.password,
      })
    );

    if (loginUser.rejected.match(resultAction)) {
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
  };

  return (
    <div className='pt-36 min-h-screen bg-gray-100'>
      <header className='max-w-lg mx-auto'>
        <div className='text-4xl font-bold text-green-500 text-center'>
          DevCircle
        </div>
      </header>
      <div className='auth-card'>
        <div className='mb-3'>
          <h3 className='font-bold text-2xl'>Welcome to DevCircle</h3>
          <p className='text-gray-600 pt-2'>Sign in to your account.</p>
        </div>

        <LoginForm onSubmit={(values) => handleFormSubmit(values)} />
      </div>
      <div className='max-w-lg mx-auto text-center mt-12 mb-6'>
        <p>
          Don&apos;t have an account? &nbsp;
          <Link
            to='/register'
            className='font-bold text-green-700 hover:underline'
          >
            Sign Up
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
