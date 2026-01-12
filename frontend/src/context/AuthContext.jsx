import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobService } from '../services/jobService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = unknown
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hydrateAuth = () => {
      try {
        const token = jobService.getToken?.() || localStorage.getItem('token');

        if (token) {
          const userData = jobService.getCurrentUser();
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateAuth();
  }, []);

  const login = async (email, password) => {
    const response = await jobService.login(email, password);

    // IMPORTANT: persist immediately
    if (response?.token) {
      localStorage.setItem('token', response.token);
    }

    setIsAuthenticated(true);
    setUser(response.user);

    return response;
  };

  const logout = () => {
    jobService.logout();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
