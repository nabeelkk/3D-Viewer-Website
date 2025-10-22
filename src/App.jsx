import React from 'react';
import { StrictMode } from 'react';
import Dashboard from './pages/Dashboard';
import './App.css'

function App() {
  return (
      <StrictMode>
        <div className="App">
          <Dashboard />
        </div>
      </StrictMode>
  );
}

export default App;