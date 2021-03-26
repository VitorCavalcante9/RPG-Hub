import React from 'react';
import { RpgProvider } from './contexts/RpgHomeContext';
import Routes from './routes';

import './styles/global.css';

function App() {
  return (
    <RpgProvider>
      <Routes />
    </RpgProvider>
  );
}

export default App;
