import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay';

const Callback = () => {
    const { handleRedirectCallback, isAuthenticated, error } = useAuth0();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(true);

    // Debug logging
    console.log('Callback Component Debug:');
    console.log('- isProcessing:', isProcessing);
    console.log('- isAuthenticated:', isAuthenticated);
    console.log('- error:', error);
    console.log('- current URL:', window.location.href);

    useEffect(() => {
        const processCallback = async () => {
            try {
                console.log('Starting to process callback...');
                // Process the authentication callback
                await handleRedirectCallback();
                console.log('handleRedirectCallback completed successfully');
                setIsProcessing(false);
            } catch (err) {
                console.error('Error handling callback:', err);
                setIsProcessing(false);
            }
        };
        processCallback();
    }, [handleRedirectCallback]);

    useEffect(() => {
        console.log('Navigation effect triggered:');
        console.log('- isProcessing:', isProcessing);
        console.log('- isAuthenticated:', isAuthenticated);
        
        // Once processing is complete, check authentication and navigate
        if (!isProcessing && isAuthenticated) {
            console.log('Redirecting to /dashboard...');
            // Force a small delay to ensure Auth0 state is fully updated
            setTimeout(() => {
                console.log('Executing navigation to /dashboard');
                navigate('/dashboard', { replace: true });
            }, 100);
        } else if (!isProcessing) {
            console.log('Redirecting to / (not authenticated)');
            navigate('/', { replace: true }); // Redirect to home or an error page if not authenticated
        }
    }, [isProcessing, isAuthenticated, navigate]);

    // Display any Auth0 errors
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Show loading state while processing
    return <div aria-live="polite" aria-busy={true}>
        <LoadingOverlay />
    </div>
};

export default Callback;