import { combineReducers } from 'redux';
import usersReducer from './users';
import postsReducer from './posts';
import globalsReducer from './globals';

const reducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  globals: globalsReducer,
});

export default reducer;
