import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { Header } from './Header';
import { store } from '../../store';

const mockStore = configureMockStore();

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

  it('should contain the correct passed logged in userName prop', async () => {
    const mockedStore = mockStore({
      users: {
        userInfo: {
          name: 'aly',
        },
      },
    });

    const specificWrapper = mount(
      <Router>
        <Provider store={mockedStore}>
          <Header socket={null} />
        </Provider>
      </Router>
    );

    const loggedInUser = await specificWrapper.find({
      id: 'logged-in-userName',
    });

    expect(loggedInUser.text()).toEqual(loggedInUserName);
  });
});
