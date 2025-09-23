import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App';
import { getApiAudience } from './utils/api';

// Defer Google Tag Manager initialization to avoid blocking initial render
const initializeGTM = () => {
  import('react-gtm-module').then(({ default: TagManager }) => {
    const tagManagerArgs = {
      gtmId: import.meta.env.VITE_GTM_ID || 'G-XF74RC576V'
    };
    TagManager.initialize(tagManagerArgs);
  });
};

// Initialize GTM after page load to avoid blocking LCP
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGTM);
} else {
  // If DOM is already loaded, initialize immediately
  initializeGTM();
}

// Check if Auth0 credentials are available
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

const AppWithAuth = () => {
  // If Auth0 credentials are not provided, show a configuration error
  if (!auth0Domain || !auth0ClientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Configuration Required
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Auth0 credentials are not configured. Please set the following environment variables:
          </p>
          <div className="text-left bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm font-mono">
            <div>VITE_AUTH0_DOMAIN=your-auth0-domain</div>
            <div>VITE_AUTH0_CLIENT_ID=your-auth0-client-id</div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
            Contact your administrator for the correct credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback',
        audience: getApiAudience(), // Explicitly set audience here
      }}
    >
      <App />
    </Auth0Provider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>
);