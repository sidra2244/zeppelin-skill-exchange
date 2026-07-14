import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

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
  const [switcherToggle, setSwitcherToggle] = useState(false);
  
  // Profile Modals
  const [isProfileInfoModal, setIsProfileInfoModal] = useState(false);
  const [isProfileAddressModal, setIsProfileAddressModal] = useState(false);
  const [isPasswordModal, setIsPasswordModal] = useState(false);

  // const colors = {
  //   primary: '#7158E2',
  //   primaryDark: '#6B4CE6',
  //   secondary: '#EFEAFA',
  //   secondaryLight: '#F4F0FF',
  //   text: '#1A1A1A',
  //   textSecondary: '#4A4A4A',
  //   white: '#FFFFFF',
  //   error: '#EF4444',
  //   success: '#10B981'
  // };

  const [userData, setUserData] = useState({
    name: 'Hassan Adil',
    created_at: '2026-07-13',
    avatar: 'src/images/user/owner.png',
    email: 'thedevhassan@gmail.com',
    bio: 'abracadabra',
    firstName: 'Hassan',
    lastName: 'Adil',
    latitude: '34.0489° N',
    longitude: '111.0937° W',
    cityState: 'Islamabad',
    country: 'Pakistan'
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
          setUserData(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setUserData(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setUserData(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.put('/user/profile', data);
      setUserData(response.data);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateLocation = async (data) => {
    try {
      const response = await api.put('/user/location', data);
      setUserData(response.data);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (data) => {
    try {
      await api.post('/auth/change-password', data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return (
    <UserContext.Provider value={{
      
      user,
      userData,
      setUserData,
      loading,
      isAuthenticated,
      switcherToggle,
      setSwitcherToggle,
      isProfileInfoModal,
      setIsProfileInfoModal,
      isProfileAddressModal,
      setIsProfileAddressModal,
      isPasswordModal,
      setIsPasswordModal,
      login,
      signup,
      logout,
      updateProfile,
      updateLocation,
      changePassword
    }}>
      {children}
    </UserContext.Provider>
  );
};