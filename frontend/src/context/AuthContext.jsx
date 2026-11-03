import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      const currentUser = res.data.data;
      setUser(currentUser);
      setRole(currentUser.role);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { token, data: userData } = res.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
    return userData;
  };

  const register = async (userDataInput) => {
    const res = await api.post('/auth/register', userDataInput);
    const { token, data: userData } = res.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    setRole(userData.role);
    setIsAuthenticated(true);
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network errors on logout
    }
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, loading, login, register, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
