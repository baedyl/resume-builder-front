import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    const { handleRedirectCallback, isAuthenticated, error } = useAuth0();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Process the authentication callback
                await handleRedirectCallback();
                setIsProcessing(false);
            } catch (err) {
                console.error('Error handling callback:', err);
                setIsProcessing(false);
            }
        };
        processCallback();
    }, [handleRedirectCallback]);

    useEffect(() => {
        // Once processing is complete, check authentication and navigate
        if (!isProcessing && isAuthenticated) {
            navigate('/my-resumes');
        } else if (!isProcessing) {
            navigate('/'); // Redirect to home or an error page if not authenticated
        }
    }, [isProcessing, isAuthenticated, navigate]);

    // Display any Auth0 errors
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return <div className="text-gray-900 dark:text-gray-100 transition-colors">Loading...</div>;
};

export default Callback;