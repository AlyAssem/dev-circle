import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import Posts from './Posts';

const mockStore = configureMockStore();

describe('Posts', () => {
  describe('check number of posts rendered', () => {
    describe('given there are no posts in the redux store.', () => {
      it('should not have any Post components rendered.', async () => {
        const mockedStore = mockStore({
          users: {
            userInfo: {
              name: 'aly',
            },
          },
          posts: {
            posts: [],
          },
        });

        const specificWrapper = mount(
          <Provider store={mockedStore}>
            <Posts socket={null} />
          </Provider>
        );

        expect(specificWrapper.find('Post').length).toEqual(0);
      });
    });

    describe('given there are 2 posts in the redux store.', () => {
      it('should render 2 Post components.', async () => {
        const mockedStore = mockStore({
          users: {
            userInfo: {
              name: 'aly',
            },
          },
          posts: {
            posts: [
              {
                user: {
                  id: 'da12970d-d033-429c-8717-04a028261c3f',
                  name: 'Aly',
                  email: 'aly@aly.com',
                  created_at: '2022-03-17T16:19:43.956Z',
                  updated_at: '2022-03-17T16:19:43.956Z',
                },
                title: 'test',
                content: 'content abc',
                id: '5a29f89c-8aed-43dd-bce9-d29899931973',
                like_count: 0,
                comment_count: 0,
                created_at: '2022-03-29T13:10:36.999Z',
                updated_at: '2022-03-29T13:10:36.999Z',
              },
              {
                user: {
                  id: 'da12970d-d033-429c-8717-04a028261c3f',
                  name: 'Aly',
                  email: 'aly@aly.com',
                  created_at: '2022-03-17T16:19:43.956Z',
                  updated_at: '2022-03-17T16:19:43.956Z',
                },
                title: 'test',
                content: 'content abc',
                id: '5a29f89c-8aed-43dd-bce9-d29899931974',
                like_count: 0,
                comment_count: 0,
                created_at: '2022-03-29T13:10:36.999Z',
                updated_at: '2022-03-29T13:10:36.999Z',
              },
            ],
          },
        });

        const specificWrapper = mount(
          <Provider store={mockedStore}>
            <Posts socket={null} />
          </Provider>
        );

        expect(specificWrapper.find('Post').length).toEqual(2);
      });
    });
  });
});
