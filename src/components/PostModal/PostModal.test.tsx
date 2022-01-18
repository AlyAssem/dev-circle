/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import PostModal from './PostModal';
import { store } from '../../store';

describe('PostModal', () => {
  let wrapper: ReactWrapper<React.FC>;
  const title = 'Add Post';
  const action = 'Create';

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Provider store={store}>
          <PostModal title={title} action={action} onClose={() => {}} />
        </Provider>
      </Router>
    );
  });

  it('should have the title and action text rendered correctly when passed as a prop', () => {
    const modalTitle = wrapper.find({ id: 'modal-title' });
    const modalAction = wrapper.find({ id: 'modal-action' });

    expect(modalTitle.text()).toEqual(title);
    expect(modalAction.text()).toEqual(action);
  });

  it('should have the modal action button disabled initially', () => {
    const modalAction = wrapper.find({ id: 'modal-action' });

    expect(modalAction.props().disabled).toBe(true);
  });

  describe('the user enters the post title and post content', () => {
    beforeEach(() => {
      const postTitleInput = wrapper.find({ id: 'post-title' });
      const postContentInput = wrapper.find({ id: 'post-content' });

      postTitleInput.simulate('change', {
        target: { value: 'test title' },
      });

      postContentInput.simulate('change', {
        target: { value: 'test content' },
      });
    });

    it('should have the modal action button enabled', () => {
      const modalAction = wrapper.find({ id: 'modal-action' });

      expect(modalAction.props().disabled).toBe(false);
    });
  });
});
