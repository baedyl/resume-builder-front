import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { useGTMContext } from '../contexts/GTMContext';

const NavBar: React.FC = () => {
  // Use Auth0 directly
  const { isAuthenticated, logout, user } = useAuth0();
  const { trackButtonClick } = useGTMContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  // Close dropdown when navigating
  useEffect(() => {
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    trackButtonClick('logout', 'navigation');
    logout({ returnTo: window.location.origin } as any); // Adjust logout logic as needed
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    trackButtonClick('dark_mode_toggle', 'preferences');
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Ensure theme is set on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Get user initials for fallback avatar
  const getUserInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const mainLinks = [
    { label: 'Home', to: '/dashboard' },
    { label: 'Resumes', to: '/my-resumes' },
    { label: 'Cover Letters', to: '/cover-letters' },
    { label: 'Job Tracker', to: '/job-tracker' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 dark:text-gray-100 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* App Logo */}
          <Link to="/" className="flex items-center pt-2 transition duration-300 hover:opacity-80 overflow-hidden">
            <img 
              src={isDarkMode ? "/logo_dark_small.svg" : "/logo_white_small.svg"} 
              alt="Resume Builder" 
              className="w-auto max-h-full"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {/* Render main navigation links */}
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${location.pathname === link.to ? 'text-blue-500 dark:text-blue-400 font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            {/* Theme Toggle (Desktop) */}
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-blue-500" />
              )}
            </button>

            {/* User/Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center"
                  title="User Profile"
                >
                  {user?.picture ? (
                    <img 
                      src={user.picture} 
                      alt="User Profile" 
                      className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-colors" 
                      loading="lazy"
                      decoding="async"
                      width={32}
                      height={32}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-colors shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {getUserInitials(user?.name || (user as any)?.email)}
                      </span>
                    </div>
                  )}
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg transition-colors">
                    <Link
                      to="/resume"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      New Resume
                    </Link>
                    <Link
                      to="/my-resumes"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      My Resumes
                    </Link>
                    <Link 
                      to="/subscription" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Subscription
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4 items-center">
                <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200"
            aria-label="Open Menu"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
              {isDarkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-blue-500" />
              )}
            </button>

            {mainLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${location.pathname === link.to ? 'text-blue-500 dark:text-blue-400 font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;