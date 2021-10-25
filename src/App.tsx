import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/HomePage/LoginPage';

const App: React.FC = () => (
  <div className='h-screen w-screen'>
    <Router>
      <Route path='/' component={HomePage} exact />
      <Route path='/login' component={LoginPage} />
    </Router>
  </div>
);

export default App;
