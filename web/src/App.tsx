import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { RpgProvider } from './contexts/RpgHomeContext';
import { SessionProvider } from './contexts/SessionContext';
import { positions, Provider as AlertProvider} from 'react-alert';
import Routes from './routes';

import './styles/global.css';
import Alert from './components/Alert';

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT
};

function App() {
  return (
    <AlertProvider template={Alert} {...options}>
      <AuthProvider>
        <RpgProvider>
          <SessionProvider>
            <Routes />
          </SessionProvider>
        </RpgProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
