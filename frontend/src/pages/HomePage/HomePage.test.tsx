import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';

import { HomePage } from './HomePage';
import { store } from '../../store';

describe('HomePage', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
    });

    wrapper = mount(
      <Router>
        <Provider store={store}>
          <HomePage history={history} />
        </Provider>
      </Router>
    );
  });

  it('should contain a logout button', () => {
    console.log(wrapper.debug());
    // expect(wrapper.find('#logout-button').exists).toBeTruthy();
  });
});
