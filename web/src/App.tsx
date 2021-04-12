import React from 'react';
import { RpgProvider } from './contexts/RpgHomeContext';
import { SessionProvider } from './contexts/SessionContext';
import Routes from './routes';

import './styles/global.css';

function App() {
  return (
    <RpgProvider>
      <SessionProvider>
        <Routes />
      </SessionProvider>
    </RpgProvider>
  );
}

export default App;
