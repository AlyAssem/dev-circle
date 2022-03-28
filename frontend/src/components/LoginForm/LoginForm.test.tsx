import React from 'react';
import { waitFor } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';

import { LoginForm } from './LoginForm';

const simulateChangeOnInput = (
  wrapper: ReactWrapper,
  inputSelector: string,
  name: string,
  newValue: string
) => {
  const input = wrapper.find(inputSelector);
  input.simulate('change', {
    target: { name, value: newValue },
  });

  return wrapper.find(inputSelector);
};

describe('Login Form', () => {
  let formWrapper: ReactWrapper;
  const onSubmit = jest.fn();

  beforeEach(() => {
    // mount needs to be used here instead of shallow,
    // because of how useFormik onSubmit works the mock onsubmit is not called without the dive into components.
    formWrapper = mount(<LoginForm onSubmit={onSubmit} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('user login.', () => {
    describe('given all fields are valid', () => {
      it('should call onSubmit function for the login form.', async () => {
        simulateChangeOnInput(
          formWrapper,
          'input#email',
          'email',
          'aly@aly.com'
        );

        simulateChangeOnInput(
          formWrapper,
          'input#password',
          'password',
          '123456789'
        );

        formWrapper.simulate('submit');

        await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      });
      it('should call the onSubmit with the valid fields correctly.', async () => {
        simulateChangeOnInput(
          formWrapper,
          'input#email',
          'email',
          'aly@aly.com'
        );

        simulateChangeOnInput(
          formWrapper,
          'input#password',
          'password',
          '123456789'
        );

        formWrapper.simulate('submit');

        await waitFor(() =>
          expect(onSubmit).toHaveBeenCalledWith({
            email: 'aly@aly.com',
            password: '123456789',
          })
        );
      });
    });

    describe('given all fields are empty.', () => {
      it('should not call onsubmit for the form.', async () => {
        formWrapper.simulate('submit');

        await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
      });
    });

    describe('given one of the fields is empty.', () => {
      it('should not call onsubmit for the form.', async () => {
        simulateChangeOnInput(
          formWrapper,
          'input#email',
          'email',
          'aly@aly.com'
        );
        formWrapper.simulate('submit');

        await waitFor(() => expect(onSubmit).not.toHaveBeenCalled());
      });
    });
  });
});
