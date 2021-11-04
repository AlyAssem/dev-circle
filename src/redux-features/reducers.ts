import { combineReducers } from 'redux';
import usersReducer from './users';

const reducer = combineReducers({
  users: usersReducer,
});

export default reducer;
