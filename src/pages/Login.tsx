import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="text-center mb-6">
                    <img src={'/resume-logo.svg'} alt="Logo" className="h-40 mx-auto" />
                    <h2 className="text-2xl font-bold mt-4">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Log in to continue building your professional resume.</p>
                </div>
                <button
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                    onClick={() => loginWithRedirect()}
                >
                    Log in
                </button>
                <div className="mt-4 text-center">
                    <a href="/forgot-password" className="text-blue-500 hover:underline">
                        Forgot Password?
                    </a>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:underline">
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;