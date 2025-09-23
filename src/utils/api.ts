// API utility functions to handle environment variables safely

export const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.warn('VITE_API_URL is not defined. Using fallback URL.');
    // Return a fallback URL or throw an error based on your needs
    return 'https://api.proairesume.online'; // Replace with your actual API URL
  }
  
  return apiUrl;
};

export const getApiAudience = (): string => {
  const audience = import.meta.env.VITE_API_AUDIENCE;
  
  if (!audience) {
    console.warn('VITE_API_AUDIENCE is not defined. Using fallback audience.');
    return 'https://api.proairesume.online'; // Replace with your actual audience
  }
  
  return audience;
};

export const getStripePublicKey = (): string => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!stripeKey) {
    console.warn('VITE_STRIPE_PUBLIC_KEY is not defined.');
    return '';
  }
  
  return stripeKey;
};

// Safe fetch wrapper that handles undefined API URLs
export const safeFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const apiUrl = getApiUrl();
  const fullUrl = `${apiUrl}${endpoint}`;
  
  return fetch(fullUrl, options);
};
