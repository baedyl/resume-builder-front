import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';

const Callback = () => {
    const { handleRedirectCallback, isAuthenticated, isLoading, error } = useAuth0();
    const navigate = useNavigate();
    const [hasHandled, setHasHandled] = useState(false);
    const [callbackError, setCallbackError] = useState<Error | null>(null);

    useEffect(() => {
        const processCallback = async () => {
            const url = new URL(window.location.href);
            const hasCode = url.searchParams.has('code');
            const hasState = url.searchParams.has('state');

            if (!hasCode || !hasState) {
                console.warn('Callback page reached without Auth0 code/state params');
                setHasHandled(true);
                return;
            }

            try {
                const result = await handleRedirectCallback();
                console.log('Auth0 callback succeeded:', result);
            } catch (err) {
                console.error('Auth0 callback error:', err);
                setCallbackError(err instanceof Error ? err : new Error(String(err)));
            } finally {
                setHasHandled(true);
            }
        };
        processCallback();
    }, [handleRedirectCallback]);

    useEffect(() => {
        if (!hasHandled || isLoading) return;

        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [hasHandled, isLoading, isAuthenticated, navigate]);

    const displayError = callbackError || error;

    if (displayError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                        Authentication Error
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {displayError.message}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div aria-live="polite" aria-busy={true}>
            <LoadingOverlay />
        </div>
    );
};

export default Callback;
