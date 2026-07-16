import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data
      // api.get('/auth/me').then(response => {
      //   setUser(response.data);
      //   setLoading(false);
      // });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      // const response = await api.post('/auth/login', { email, password });
      // localStorage.setItem('token', response.data.token);
      // setUser(response.data.user);
      // return { success: true };
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const signup = async (userData) => {
    try {
      // const response = await api.post('/auth/signup', userData);
      // localStorage.setItem('token', response.data.token);
      // setUser(response.data.user);
      // return { success: true };
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { user, loading, login, logout, signup };
};