import { combineReducers } from 'redux';
import usersReducer from './users';
import postsReducer from './posts';

const reducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
});

export default reducer;
