import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import cls from 'classnames';
import { IRegisterFormValues } from '../../interfaces';
import EyeOffIcon from '../../icons/EyeOffIcon';
import EyeIcon from '../../icons/EyeIcon';

interface IRegisterFormProps {
  onSubmit: (formValues: IRegisterFormValues) => void;
}

interface IRegisterFormState {
  shouldShowPassword: boolean;
  shouldShowConfirmPassword: boolean;
}

export const RegisterForm: React.FC<IRegisterFormProps> = ({ onSubmit }) => {
  const [state, setState] = useState<IRegisterFormState>({
    shouldShowPassword: false,
    shouldShowConfirmPassword: false,
  });

  const initialValues: IRegisterFormValues = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const formik = useFormik({
    initialValues,
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
    onSubmit: async (formValues) => {
      onSubmit(formValues);
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
    <form
      id='register-form'
      className='flex flex-col'
      onSubmit={formik.handleSubmit}
    >
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
          className={cls('card__input', {
            'border-red-600': formik.touched.userName && formik.errors.userName,
          })}
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
          className={cls('card__input', {
            'border-red-600': formik.touched.email && formik.errors.email,
          })}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched.email && formik.errors.email ? (
        <div id='emailError' className='text-red-500 mb-3'>
          {formik.errors.email}
        </div>
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
          className={cls('card__input', {
            'border-red-600': formik.touched.password && formik.errors.password,
          })}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          id='showPasswordIcon'
          type='button'
          className='text-green-600 absolute right-3'
          onClick={handleShowPasswordToggle}
        >
          {state.shouldShowPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {formik.touched.password && formik.errors.password ? (
        <div id='passwordError' className='text-red-500 mb-3'>
          {formik.errors.password}
        </div>
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
          className={cls('card__input', {
            'border-red-600':
              formik.touched.confirmPassword && formik.errors.confirmPassword,
          })}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type='button'
          className='text-green-600 absolute right-3'
          onClick={handleShowConfirmPasswordToggle}
        >
          {state.shouldShowConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <div className='text-red-500 mb-3'>{formik.errors.confirmPassword}</div>
      ) : null}
      <div className='flex justify-center items-center'>
        <button
          id='registerBtn'
          className='auth-card__submit-btn'
          type='submit'
          disabled={!formik.isValid}
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};
