import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyAuth, loginAdmin, continueAsGuest } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const result = await verifyAuth();
      if (result.success) {
        setUser({ role: result.role });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = async (password) => {
    try {
      const result = await loginAdmin(password);
      if (result.success) {
        localStorage.setItem('authToken', result.token);
        setUser({ role: result.role });
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const guest = async () => {
    try {
      const result = await continueAsGuest();
      if (result.success) {
        localStorage.removeItem('authToken');
        setUser({ role: result.role });
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isGuest = () => {
    return user?.role === 'guest';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    guest,
    logout,
    isAdmin,
    isGuest,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
