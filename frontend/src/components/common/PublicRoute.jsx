import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const PublicRoute = () => {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F4F0FF' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto" style={{ 
            borderColor: '#7158E2',
            borderTopColor: 'transparent'
          }}></div>
          <p className="mt-4" style={{ color: '#7158E2' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/profile" replace /> : <Outlet />;
};

export default PublicRoute;