import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import { RegisterPage } from './RegisterPage';
import { store } from '../../store';

describe('RegisterPage', () => {
  let wrapper: ReactWrapper<React.FC>;

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <RegisterPage />
      </Provider>
    );
  });

  it('should have a "register" form', () => {
    expect(wrapper.find('#register-form')).toHaveLength(1);
  });

  it('should contain a form having 4 input fields', () => {
    const form = wrapper.find({ id: 'register-form' });

    expect(form.find('input')).toHaveLength(4);
  });
});
