import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token")); 
  const [loading, setLoading] = useState(true);

  // 1. Defined first so refreshSession can safely invoke it
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setLoading(false);
  }, []);

  // 2. Uses the token already attached by your interceptor
  const refreshSession = useCallback(async () => {
    const storedToken = localStorage.getItem("token")
    console.log('Refreshing session with token:', storedToken); // Debugging line
    if ( !storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      // Use apiClient so the VITE_BACKEND_URL baseURL and the
      // Authorization Bearer token interceptor are both applied.
      const response = await apiClient.get('/api/auth/session');
      setUser(response.data.user);
      console.log('Session refreshed:', response.data.user);  
    } catch (error) {
      toast.error("Session expired. Please log in again.");
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = async ({ email, password, roletype }) => {
    try {
      // Use apiClient so the VITE_BACKEND_URL baseURL is applied.
      const response = await apiClient.post('/api/auth/login', { email, password, roletype });

      const { user: userData, token: userToken } = response.data;

      // Interceptor will automatically pick this up for subsequent requests
      localStorage.setItem("token", userToken);
   

      setUser(userData);
      setToken(userToken);
      return response;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  // 3. Runs exactly once on application mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
