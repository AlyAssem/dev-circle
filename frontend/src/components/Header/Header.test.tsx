import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import { Header } from './Header';
import { store } from '../../store';

describe('Header', () => {
  let wrapper: ReactWrapper;
  const loggedInUserName = 'aly';

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Provider store={store}>
          <Header socket={null} />
        </Provider>
      </Router>
    );
  });

  it('should render', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should contain a logout button', () => {
    const logoutButton = wrapper.find({ id: 'logout-button' });
    expect(logoutButton.exists()).toBeTruthy();
  });

  it('should contain the correct passed logged in userName prop', () => {
    const loggedInUser = wrapper.find({ id: 'logged-in-userName' });

    expect(loggedInUser.text()).toEqual(loggedInUserName);
  });
});
