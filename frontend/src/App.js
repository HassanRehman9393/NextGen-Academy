import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/utils/authContext';
import Welcome from './components/Welcome';
import AuthRoutes from './auth/routes/AuthRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/*" element={<AuthRoutes />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
