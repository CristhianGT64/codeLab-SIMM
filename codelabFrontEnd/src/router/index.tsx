import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Dashboard from '../pages/dashboard';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
);

export default AppRouter;