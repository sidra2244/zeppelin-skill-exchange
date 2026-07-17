// components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import Button from "./Button";
import Logo from "../../assets/logo.png";
import { COLORS } from "../../utils/constants";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useUser();
  const colors = COLORS;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setOpen(false);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    setOpen(false);
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const navLinks = [
    { label: "Browse", to: "/browse" },
    { label: "How It Works", to: "#", action: () => scrollToSection('how-it-works') },
    { label: "About", to: "/about" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b"
          : "bg-white border-b"
      }`}
      style={{ borderColor: colors.secondary }}
    >
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-lg transition duration-300 group-hover:scale-105 bg-white">
              <img src={Logo} alt="LocalSkill Exchange Board Logo" className="w-full h-full object-cover" />
            </div>
            <div className="leading-none hidden sm:block">
              <h1 className="text-2xl font-bold" style={{ color: colors.text }}>LocalSkill</h1>
              <p className="text-sm" style={{ color: colors.textSecondary }}>Exchange Board</p>
            </div>
          </Link>

          {/* Desktop Search Bar - Centered when authenticated */}
          {isAuthenticated && (
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for skills, people, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border px-4 py-2.5 pl-11 text-sm outline-none transition-all"
                  style={{
                    borderColor: colors.secondary,
                    color: colors.text,
                    backgroundColor: colors.secondaryLight
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.secondary}
                />
                <Search 
                  size={18} 
                  className="absolute left-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: colors.textSecondary }}
                />
              </form>
            </div>
          )}

          {/* Desktop Links - Centered (hidden when logged in) */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center flex-1 justify-center gap-12">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action || (() => navigate(item.to))}
                  className="relative font-semibold transition group pb-1 bg-transparent border-none cursor-pointer"
                  style={{ color: colors.textSecondary }}
                >
                  {item.label}
                  <span 
                    className="absolute left-0 -bottom-1 w-0 h-[3px] rounded-full transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link to="/create-listing">
                  <Button variant="primary" size="sm">
                    <Plus size={16} className="mr-1" />
                    Create
                  </Button>
                </Link>

                

                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: colors.text
                  }}
                >
                  <User size={16} style={{ color: colors.primary }} />
                  <span className="text-sm font-medium hidden lg:block">
                    {user?.username || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg transition hover:bg-gray-100"
                  style={{ color: colors.textSecondary }}
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition border"
            style={{ borderColor: colors.secondary }}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-t md:hidden overflow-hidden"
            style={{ borderColor: colors.secondary }}
          >
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Mobile Search - Only for logged in */}
              {isAuthenticated ? (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-full border px-4 py-2.5 pl-10 text-sm outline-none"
                    style={{
                      borderColor: colors.secondary,
                      color: colors.text,
                      backgroundColor: colors.secondaryLight
                    }}
                  />
                  <Search 
                    size={16} 
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: colors.textSecondary }}
                  />
                </form>
              ) :

              
              (navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action || (() => { navigate(item.to); setOpen(false); })}
                  className="font-semibold text-left bg-transparent border-none cursor-pointer py-2"
                  style={{ color: colors.textSecondary }}
                >
                  {item.label}
                </button>
              )))}

              <hr style={{ borderColor: colors.secondary }} />

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      <User size={18} style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: colors.text }}>
                        {user?.username || user?.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/create-listing" 
                    onClick={() => setOpen(false)}
                  >
                    <Button variant="primary" fullWidth>
                      <Plus size={16} className="mr-1" />
                      Create Listing
                    </Button>
                  </Link>

                  

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition border"
                    style={{ 
                      borderColor: colors.secondary,
                      color: colors.textSecondary
                    }}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="secondary" fullWidth>
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button variant="primary" fullWidth>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;