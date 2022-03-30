import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore, { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';

import Post from './Post';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Post', () => {
  describe('post is rendered with data.', () => {
    const postData = {
      user: {
        created_at: '2022-03-29T13:38:20.693Z',
        email: 'aly2@aly2.com',
        id: 'aa790c3f-f6d2-4010-8b41-16c686de0518',
        name: 'aly2',
        updated_at: '2022-03-29T13:38:20.693Z',
      },
      comments: [],
      comment_count: 0,
      content: 'content\ndef',
      created_at: '2022-03-29T13:38:39.776Z',
      id: 'b9168f50-2e1b-4d33-b5ed-89e35e3bfed9',
      like_count: 0,
      title: 'test',
    };
    describe('given the post is liked by the user.', () => {
      const mockedStore: MockStore = mockStore({
        users: {
          userInfo: {
            name: 'aly',
          },
        },
        posts: {
          posts: [{ ...postData, like_count: 1 }],
        },
      });
      const globalStatePost = mockedStore.getState().posts?.posts[0];
      const specificWrapper = mount(
        <Provider store={mockedStore}>
          <Post post={globalStatePost} socket={null} isPostLikedByUser />
        </Provider>
      );

      it('should have the filled like icon (green icon).', async () => {
        const FilledLikeIcon = specificWrapper.find('FilledLikeIcon').get(0);

        expect(FilledLikeIcon).toBeDefined();
      });

      it('should have a span showing like count of 1.', async () => {
        const likeCountWrapper = specificWrapper.find('span#likeCount');

        expect(likeCountWrapper.text()).toEqual('1');
      });
    });

    describe('given the post is not liked by the user.', () => {
      const mockedStore: MockStore = mockStore({
        users: {
          userInfo: {
            name: 'aly',
          },
        },
        posts: {
          posts: [{ ...postData }],
        },
      });
      const globalStatePost = mockedStore.getState().posts?.posts[0];
      const specificWrapper = mount(
        <Provider store={mockedStore}>
          <Post
            post={globalStatePost}
            socket={null}
            isPostLikedByUser={false}
          />
        </Provider>
      );
      it('should have the normal like icon (not filled).', async () => {
        const LikeIcon = specificWrapper.find('LikeIcon').get(0);
        expect(LikeIcon).toBeDefined();
      });

      it('should have a span showing like count of 0.', async () => {
        const likeCountWrapper = specificWrapper.find('span#likeCount');

        expect(likeCountWrapper.text()).toEqual('0');
      });
    });

    describe('given post has a comment', () => {
      const mockedStore: MockStore = mockStore({
        users: {
          userInfo: {
            name: 'aly',
          },
        },
        posts: {
          posts: [
            {
              ...postData,
              comments: [
                {
                  text: 'test',
                },
              ],
              comment_count: 1,
            },
          ],
        },
      });
      const globalStatePost = mockedStore.getState().posts?.posts[0];
      const specificWrapper = mount(
        <Provider store={mockedStore}>
          <Post post={globalStatePost} socket={null} isPostLikedByUser />
        </Provider>
      );
      it('should have a span showing comment count of 1.', async () => {
        const commentCountWrapper = specificWrapper.find('span#commentCount');

        expect(commentCountWrapper.text()).toEqual('1');
      });
    });

    describe('given post does not have a comment', () => {
      const mockedStore: MockStore = mockStore({
        users: {
          userInfo: {
            name: 'aly',
          },
        },
        posts: {
          posts: [
            {
              ...postData,
            },
          ],
        },
      });
      const globalStatePost = mockedStore.getState().posts?.posts[0];
      const specificWrapper = mount(
        <Provider store={mockedStore}>
          <Post post={globalStatePost} socket={null} isPostLikedByUser />
        </Provider>
      );
      it('should have a span showing comment count of 0.', async () => {
        const commentCountWrapper = specificWrapper.find('span#commentCount');

        expect(commentCountWrapper.text()).toEqual('0');
      });
    });
  });
});
