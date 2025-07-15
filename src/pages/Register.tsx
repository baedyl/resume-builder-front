// pages/Register.tsx
import { useAuth0 } from '@auth0/auth0-react';

const Register: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignup = () => {
    loginWithRedirect({ screen_hint: 'signup' } as any);
  };

  console.log('Redirect URI:', window.location.origin + '/callback'); // Adjust the path if needed

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-colors">
        <div className="text-center mb-6">
          <img src={'/resume-logo.svg'} alt="Logo" className="h-40 mx-auto" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors">Create Your Account</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">
            Join us to start building your professional resume today and land your dream job.
          </p>
        </div>
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Up Now
        </button>
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300 transition-colors">
          <p>
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;