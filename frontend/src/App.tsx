import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';

const App: React.FC = () => (
  <div>
    <Router>
      <Route path='/' component={HomePage} exact />
      <Route path='/posts/:id' component={HomePage} />
      <Route path='/login' component={LoginPage} />
      <Route path='/register' component={RegisterPage} />
    </Router>
  </div>
);

export default App;