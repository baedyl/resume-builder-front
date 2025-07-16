import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md transition-colors">
                <div className="text-center mb-6">
                    <img src={'/resume-logo.svg'} alt="Logo" className="h-32 sm:h-40 mx-auto" />
                    <h2 className="text-xl sm:text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100 transition-colors">Welcome Back</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 transition-colors">Log in to continue building your professional resume.</p>
                </div>
                <button
                    className="w-full bg-blue-500 text-white p-3 sm:p-2 rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base font-medium"
                    onClick={() => loginWithRedirect()}
                >
                    Log in
                </button>
                <div className="mt-4 text-center">
                    <a href="/forgot-password" className="text-blue-500 hover:underline text-sm sm:text-base">Forgot Password?</a>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 transition-colors">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:underline">Sign up here</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;