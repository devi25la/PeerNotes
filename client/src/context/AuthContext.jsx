import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('peernotes_token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user from token on startup
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('peernotes_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem('peernotes_token');
      }
    } catch (error) {
      console.error('Failed to load user:', error.response?.data?.message || error.message);
      setUser(null);
      localStorage.removeItem('peernotes_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login action
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('peernotes_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    }
  };

  // Register action
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('peernotes_token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('peernotes_token');
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.success) {
      setUser(response.data.user);
      return response.data;
    }
  };

  // Refresh user data (e.g. credit balance change)
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Refresh user error:', err.message);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
