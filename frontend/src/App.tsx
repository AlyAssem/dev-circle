/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { useAppDispatch } from './redux-features/hooks';
import { resetPostsState } from './redux-features/posts';
import { logout } from './redux-features/users';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleOnIdle = () => {
    dispatch(resetPostsState());
    dispatch(logout());
  };

  useIdleTimer({
    timeout: 1000 * 60 * 15,
    onIdle: handleOnIdle,
  });

  return (
    <div>
      <Router>
        <Route path='/' component={HomePage} exact />
        <Route path='/register' component={RegisterPage} />
        <Route path='/login' component={LoginPage} />
        <ToastContainer />
      </Router>
    </div>
  );
};

export default App;
