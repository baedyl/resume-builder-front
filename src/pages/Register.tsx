// pages/Register.tsx
import { useAuth0 } from '@auth0/auth0-react';

const Register: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    loginWithRedirect({ screen_hint: 'signup' } as any);
  };

  console.log('Redirect URI:', window.location.origin + '/callback'); // Adjust the path if needed
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Create Your Account</h1>
        <p className="text-gray-600 mb-6 text-center">
          Join us to start building your professional resume today.
        </p>
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Register;