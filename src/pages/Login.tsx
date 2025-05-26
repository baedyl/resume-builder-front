import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Welcome!</h2>
                <form>
                    {/* <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div> */}
                    <button className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600" onClick={() => loginWithRedirect()}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;