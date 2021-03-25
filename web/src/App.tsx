import React from 'react';
import { StatusProvider } from './contexts/StatusContext';
import Routes from './routes';

import './styles/global.css';

function App() {
  return (
    <StatusProvider>
      <Routes />
    </StatusProvider>
  );
}

export default App;
