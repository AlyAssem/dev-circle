import { configureStore } from '@reduxjs/toolkit';
import reducer from './redux-features/reducers';

// JSON.parse requires a string be returned and not null from getItem
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo') || '{}')
  : {};

const preloadedState = {
  users: { userInfo: userInfoFromStorage, error: null },
};

export const store = configureStore({ reducer, preloadedState });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
