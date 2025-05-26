import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react'; // Adjust if using a different auth system
import { FaBars } from 'react-icons/fa';

const NavBar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth0(); // Replace with your auth logic
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout({ returnTo: window.location.origin } as any); // Adjust logout logic as needed
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* App Name or Logo */}
                    <a href="/" className="text-gray-700 hover:text-blue-500 transition duration-300">
                        {/* <img src="public/logo.svg" alt="Logo" className="h-32" /> */}
                        <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
                    </a>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4">
                        <a href="/" className="text-gray-700 hover:text-blue-500 transition duration-300">
                            Home
                        </a>
                        {isAuthenticated ? (
                            <>
                                <a
                                    href="/resume"
                                    className="text-gray-700 hover:text-blue-500 transition duration-300"
                                >
                                    Resume Form
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="/login"
                                    className="text-gray-700 hover:text-blue-500 transition duration-300"
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="text-gray-700 hover:text-blue-500 transition duration-300"
                                >
                                    Register
                                </a>
                            </>
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

                {/* Mobile Menu (shown when hamburger is clicked) */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md">
                        <div className="flex flex-col p-4 space-y-2">
                            <a href="/" className="text-gray-700 hover:text-blue-500">
                                Home
                            </a>
                            {isAuthenticated ? (
                                <>
                                    <a href="/resume" className="text-gray-700 hover:text-blue-500">
                                        Resume Form
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="text-gray-700 hover:text-blue-500">
                                        Login
                                    </a>
                                    <a href="/register" className="text-gray-700 hover:text-blue-500">
                                        Register
                                    </a>
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