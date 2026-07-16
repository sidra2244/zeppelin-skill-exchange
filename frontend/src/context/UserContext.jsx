// context/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, listingsAPI } from '../services/api';


const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      setIsAuthenticated(true);
      // Get user's listings if needed
      // const listings = await listingsAPI.getAll({ user: response.data.id });
      // setUserListings(listings.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      await fetchUser();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      // After registration, login automatically
      const loginResult = await login(userData.username, userData.password);
      if (loginResult.success) {
        return { success: true, user: response.data };
      }
      return { success: false, error: 'Registration successful but login failed' };
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = 'Registration failed. Please try again.';
      
      if (errorData?.username) {
        errorMessage = `Username: ${errorData.username[0]}`;
      } else if (errorData?.email) {
        errorMessage = `Email: ${errorData.email[0]}`;
      } else if (errorData?.non_field_errors) {
        errorMessage = errorData.non_field_errors[0];
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
  try {
    let isFormData = false;
    
    // Check if data is FormData (for photo upload)
    if (data instanceof FormData) {
      isFormData = true;
    }
    
    const response = await authAPI.updateMe(data, isFormData);
    setUser(response.data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data || 'Failed to update profile' };
  }
};

  const createListing = async (data) => {
    try {
      const response = await listingsAPI.create(data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to create listing' };
    }
  };

  const updateListing = async (id, data) => {
    try {
      const response = await listingsAPI.update(id, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to update listing' };
    }
  };

  const deleteListing = async (id) => {
    try {
      await listingsAPI.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Failed to delete listing' };
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loading,
      isAuthenticated,
      userListings,
      login,
      register,
      logout,
      updateProfile,
      createListing,
      updateListing,
      deleteListing,
      fetchUser,
    }}>
      {children}
    </UserContext.Provider>
  );
};