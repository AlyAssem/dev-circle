import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/HomePage/LoginPage';

const App: React.FC = () => (
  <Router>
    <Route path='/' component={HomePage} exact />
    <Route path='/login' component={LoginPage} />
  </Router>
);

export default App;
