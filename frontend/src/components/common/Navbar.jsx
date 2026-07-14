import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { COLORS } from '../../utils/constants';
import Button from './Button';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const {  isAuthenticated } = useUser();
  const colors = COLORS;
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${searchTerm}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b" style={{ 
      backgroundColor: colors.white,
      borderColor: colors.secondary
    }}>
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Left - Logo and Hamburger */}
          <div className="flex items-center gap-3">
            {/* Hamburger - Only visible on mobile */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
              style={{ color: colors.textSecondary }}
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-lg hidden sm:block" style={{ color: colors.text }}>SkillShare</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for items, categories, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border px-4 py-2 pl-10 text-sm outline-none transition-colors"
                style={{
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.secondaryLight
                }}
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.textSecondary }}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Toggle - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg md:hidden hover:bg-gray-100 transition-colors"
              style={{ color: colors.textSecondary }}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {isAuthenticated ? (
              <>
                {/* Create Listing - Desktop */}
                <Link to="/create-listing" className="hidden sm:block">
                  <Button variant="primary" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create
                  </Button>
                </Link>

                {/* Create Listing - Mobile Icon */}
                <Link to="/create-listing" className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: colors.textSecondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </Link>

                {/* Messages */}
                <Link to="/messages" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: colors.textSecondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.25 21.75 5.97 5.97 0 013.75 21c.084-1.272.682-2.448 1.582-3.303A9.7 9.7 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] flex items-center justify-center rounded-full" style={{ 
                    backgroundColor: colors.primary,
                    color: colors.white
                  }}>
                    3
                  </span>
                </Link>

                {/* Profile */}
                <Link to="/profile" className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full border-2 overflow-hidden" style={{ borderColor: colors.primary }}>
                    <img 
                      src="https://via.placeholder.com/32" 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link to="/signup" className="hidden sm:block">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
                {/* Mobile Auth Icons */}
                <Link to="/login" className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: colors.textSecondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Expanded */}
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for items, categories, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border px-4 py-2.5 pl-10 text-sm outline-none transition-colors"
                style={{
                  borderColor: colors.primary,
                  color: colors.text,
                  backgroundColor: colors.secondaryLight
                }}
                autoFocus
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.textSecondary }}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                style={{ color: colors.textSecondary }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

export default Navbar;