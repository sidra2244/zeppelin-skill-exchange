import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { COLORS } from '../../utils/constants';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const colors = COLORS;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'browse', icon: 'search', label: 'Browse', path: '/browse' },
    { id: 'profile', icon: 'user', label: 'Profile', path: '/profile' },
    { id: 'messages', icon: 'chat', label: 'Messages', path: '/messages' },
    { id: 'matches', icon: 'heart', label: 'Matches', path: '/matches' },
    { id: 'listings', icon: 'list', label: 'My Listings', path: '/my-listings' }
  ];

  const renderIcon = (iconName) => {
    const icons = {
      home: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      ),
      search: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      ),
      heart: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      ),
      chat: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.25 21.75 5.97 5.97 0 013.75 21c.084-1.272.682-2.448 1.582-3.303A9.7 9.7 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      ),
      user: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      ),
      list: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      ),
      logout: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      ),
      collapse: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
      ),
      expand: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
      ),
      plus: (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      )
    };
    return icons[iconName] || null;
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleCreateListing = () => {
    navigate('/create-listing');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`lg:sticky top-0 left-0 z-40 self-stretch flex flex-col transition-all duration-300 ease-in-out ${
          !isCollapsed ? 'translate-x-0' : 'lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
        style={{ 
          backgroundColor: colors.white,
          
          borderRight: `1px solid ${colors.secondary}`
        }}
      >
        {/* Collapse Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4`} 
             style={{ borderColor: colors.secondary }}>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 flex-shrink-0"
            style={{ color: colors.textSecondary }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              {isCollapsed ? renderIcon('expand') : renderIcon('collapse')}
            </svg>
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-4 border-b flex-shrink-0`} 
             style={{ borderColor: colors.secondary }}>
          <img 
            src={user?.photo ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_DB}/${user.photo}`: "/src/assets/defaultpfp.png"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: colors.text }}>
                {user?.username || 'Guest User'}
              </p>
              <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
                {user?.email || 'user@email.com'}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1">
          {user && navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive ? 'font-medium' : 'hover:bg-gray-50'}
                ${isCollapsed ? 'justify-center' : ''}
                relative group whitespace-nowrap
              `}
              style={({ isActive }) => ({
                color: isActive ? colors.primary : colors.textSecondary,
                backgroundColor: isActive ? colors.secondary : 'transparent'
              })}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsCollapsed(true);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                {renderIcon(item.icon)}
              </svg>
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity" 
                      style={{ 
                        backgroundColor: colors.text,
                        color: colors.white
                      }}>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
{ user &&
        <div className={`border-t flex-shrink-0`} style={{ borderColor: colors.secondary }}>
          {/* Create Listing Button */}
          <div className={`p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={handleCreateListing}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white font-medium transition hover:shadow-lg ${
                isCollapsed ? 'justify-center w-auto' : 'w-full'
              } whitespace-nowrap`}
              style={{ 
                backgroundColor: colors.primary,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                {renderIcon('plus')}
              </svg>
              {!isCollapsed && <span>Create Listing</span>}
            </button>
          </div>

          {/* Logout Button */}
          <div className={`p-3 pt-0 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-50 ${
                isCollapsed ? 'justify-center w-auto' : 'w-full'
              } whitespace-nowrap`}
              style={{ color: colors.textSecondary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                {renderIcon('logout')}
              </svg>
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
        }
      </aside>
    </>
  );
};

export default Sidebar;