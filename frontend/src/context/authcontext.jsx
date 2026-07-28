import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Added token state
  const [loading, setLoading] = useState(true); // Added loading state

  const refreshSession = async () => {
    try {
      setLoading(true);
     const {data}= await apiClient.get()
      
      // setUser(data.user);
      // setToken(data.token);
    } catch (error) {
      console.error("Session refresh failed", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  // Run session check once when app loads
  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
