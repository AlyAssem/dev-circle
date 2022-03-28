/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { History } from 'history';
import 'react-toastify/dist/ReactToastify.css';

import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { registerUser } from '../../redux-features/users';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import { IRegisterFormValues } from '../../interfaces';

interface IRegisterPageProps {
  history: History;
}

export const RegisterPage: React.FC<IRegisterPageProps> = ({
  history,
}: IRegisterPageProps) => {
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector((state) => state.users.userInfo);

  const handleFormSubmit = async (formValues: IRegisterFormValues) => {
    const resultAction = await dispatch(
      registerUser({
        email: formValues.email,
        name: formValues.userName,
        password: formValues.password,
      })
    );

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
  };

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length !== 0) {
      history.push('/');
    }
  }, [history, userInfo]);

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

        <RegisterForm onSubmit={(values) => handleFormSubmit(values)} />
      </div>
      <div className='max-w-lg mx-auto text-center mt-12 mb-6'>
        <p>
          Already a member? &nbsp;
          <Link
            id='signinLink'
            to='/login'
            className='font-bold text-green-700 hover:underline'
          >
            Sign In
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
