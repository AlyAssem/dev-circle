import { combineReducers } from 'redux';
import usersReducer from './users';
import postsReducer from './posts';
import commentsReducer from './comments';
import globalsReducer from './globals';

const reducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  comments: commentsReducer,
  globals: globalsReducer,
});

export default reducer;
