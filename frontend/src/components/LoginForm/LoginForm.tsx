import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import cls from 'classnames';
import { ILoginFormValues } from '../../interfaces';

interface ILoginFormProps {
  onSubmit: (values: ILoginFormValues) => void;
}

const LoginForm: React.FC<ILoginFormProps> = ({ onSubmit }) => {
  const initialValues: ILoginFormValues = {
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      onSubmit(values);
    },
  });
  return (
    <form
      id='login-form'
      className='flex flex-col'
      onSubmit={formik.handleSubmit}
    >
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
          className={cls('card__input', {
            'border-red-600': formik.touched.password && formik.errors.password,
          })}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </div>
      {formik.touched.password && formik.errors.password ? (
        <div className='text-red-500 mb-3'>{formik.errors.password}</div>
      ) : null}
      <div className='mx-auto'>
        <button
          id='login-button'
          className='auth-card__submit-btn'
          type='submit'
          disabled={!formik.isValid}
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export { LoginForm };
