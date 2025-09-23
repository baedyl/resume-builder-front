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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin + '/callback',
        audience: getApiAudience(), // Explicitly set audience here
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);