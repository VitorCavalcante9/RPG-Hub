import { createContext, ReactNode } from 'react';
import useAuth from './hooks/useAuth';

interface AuthContextData {
  authenticated: boolean;
  loading: boolean;
  handleLogin: (token: JSON) => void;
  handleLogout: () => void;
  getToken: () => JSON | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){
  const {
    authenticated, loading, handleLogin, handleLogout, getToken
  } = useAuth();

  return(
    <AuthContext.Provider value={{
      authenticated, 
      loading, 
      handleLogin, 
      handleLogout,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}