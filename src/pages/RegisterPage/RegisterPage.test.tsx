import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from '@testing-library/react';
import { mount, ReactWrapper, shallow } from 'enzyme';
import { Provider } from 'react-redux';

import { RegisterPage } from './RegisterPage';
import { store } from '../../store';

const updateFormikField = async (
  // eslint-disable-next-line
  nativeFieldWrapper: ReactWrapper<any, any, React.Component<{}, {}, any>>,
  targetName: string,
  value: string
) => {
  // updates values and errors
  await act(async () => {
    nativeFieldWrapper.simulate('change', {
      target: { name: targetName, value },
    });
  });
  // updates touched
  await act(async () => {
    nativeFieldWrapper.simulate('blur', { target: { name: targetName } });
  });
};

describe('RegisterPage', () => {
  let wrapper: ReactWrapper<React.FC>;

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Provider store={store}>
          <RegisterPage />
        </Provider>
      </Router>
    );
  });

  it('should have a "register" form', () => {
    expect(wrapper.find('#register-form')).toHaveLength(1);
  });

  it('should contain a form having 4 input fields', () => {
    const form = wrapper.find({ id: 'register-form' });

    expect(form.find('input')).toHaveLength(4);
  });

  it('should submit form', async () => {
    const onFormSubmit = jest.fn();
    const formWrapper = shallow(wrapper.find({ id: 'register-form' }).get(0));
    formWrapper.setProps({ onSubmit: onFormSubmit });

    formWrapper.simulate('submit');

    expect(onFormSubmit).toHaveBeenCalledTimes(1);
  });

  describe('the user populates the "email" input with invalid values', () => {
    let emailInput: ReactWrapper;

    beforeEach(() => {
      emailInput = wrapper.find({ id: 'email' });
    });

    it('should have empty email error when the value is empty', async () => {
      await updateFormikField(emailInput, 'email', '');
      // update the rendered elements in the wrapper to be able to see the errors in the updated version.
      wrapper.update();

      const emailError = wrapper.find({ id: 'emailError' });
      expect(emailError.props().children).toEqual('Required');
    });

    it('should have invalid email error when the value is invalid email', async () => {
      const email = 'test@test';
      await updateFormikField(emailInput, 'email', email);
      wrapper.update();

      const emailError = wrapper.find({ id: 'emailError' });
      expect(emailError.props().children).toEqual('Invalid email address');
    });
  });

  describe('the user populates the "password" input with invalid values', () => {
    let passwordInput: ReactWrapper;

    beforeEach(() => {
      passwordInput = wrapper.find({ id: 'password' });
    });

    it('should have empty password error when the value is empty', async () => {
      const password = '';
      await updateFormikField(passwordInput, 'password', password);
      wrapper.update();

      const passwordError = wrapper.find({ id: 'passwordError' });
      expect(passwordError.props().children).toEqual('Required');
    });
    it('should have short password error when the value is less than 8 characters', async () => {
      const password = '1234567';
      await updateFormikField(passwordInput, 'password', password);
      wrapper.update();

      const passwordError = wrapper.find({ id: 'passwordError' });

      expect(passwordError.props().children).toEqual(
        'Must be 8 characters or more'
      );
    });
  });

  describe('the user clicks on the "showPassword" icon', () => {
    it('should have the password be shown as text', async () => {
      const showPasswordIcon = wrapper.find({ id: 'showPasswordIcon' });
      await act(async () => {
        showPasswordIcon.simulate('click');
      });
      wrapper.update();
      const passwordInput = wrapper.find({ id: 'password' });

      expect(passwordInput.props().type).toEqual('text');
    });
  });
});
