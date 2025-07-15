import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin } as any); // Adjust logout logic as needed
  };

  const mainLinks = [
    { label: 'Cover Letters', to: '/cover-letters' },
    // { label: 'Templates', to: '/templates' },
    // { label: 'Examples', to: '/examples' },
    // { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Name or Logo */}
          <Link to="/" className="text-gray-700 hover:text-blue-500 transition duration-300">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {mainLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-gray-700 hover:text-blue-500 ${location.pathname === link.to ? 'text-blue-500' : ''
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center"
                >
                  {user?.picture ? (
                    <img src={user.picture} alt="User" className="h-8 w-8 rounded-full" />
                  ) : (
                    <span className="text-gray-700">{user?.name || 'User'}</span>
                  )}
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link
                      to="/resume"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      New Resume
                    </Link>
                    <Link
                      to="/my-resumes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Resumes
                    </Link>

                    <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-500">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-500">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <FaBars />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
            <div className="flex flex-col p-4 space-y-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-gray-700 hover:text-blue-500 ${location.pathname === link.to ? 'text-blue-500' : ''
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/resume"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    New Resume
                  </Link>
                  <Link
                    to="/my-resumes"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    My Resumes
                  </Link>
                  <Link
                    to="/cover-letters"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Cover Letters
                  </Link>
                  <Link to="/settings" className="text-gray-700 hover:text-blue-500">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-500">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-blue-500">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;