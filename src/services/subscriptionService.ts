import axios from 'axios';
import { 
  SubscriptionStatus, 
  SubscriptionServiceConfig, 
  SubscriptionError 
} from '../types/subscription';
import { 
  SUBSCRIPTION_PLANS, 
  SUBSCRIPTION_STATUS, 
  SUBSCRIPTION_ENDPOINTS 
} from '../constants/subscription';

class SubscriptionService {
  private config: SubscriptionServiceConfig;
  private getAccessToken: () => Promise<string>;
  private subscriptionCache: { data: SubscriptionStatus | null; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  constructor(getAccessTokenSilently: () => Promise<string>) {
    this.config = {
      apiUrl: import.meta.env.VITE_API_URL,
      stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY
    };
    this.getAccessToken = getAccessTokenSilently;

    // Validate required environment variables
    if (!this.config.apiUrl) {
      throw new SubscriptionError('VITE_API_URL environment variable is required');
    }
    if (!this.config.stripePublicKey) {
      throw new SubscriptionError('VITE_STRIPE_PUBLIC_KEY environment variable is required');
    }
  }

  private isCacheValid(): boolean {
    if (!this.subscriptionCache) return false;
    const now = Date.now();
    return (now - this.subscriptionCache.timestamp) < this.CACHE_DURATION;
  }

  private invalidateCache(): void {
    this.subscriptionCache = null;
  }

  private async makeAuthenticatedRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any
  ): Promise<T> {
    try {
      const token = await this.getAccessToken();
      const response = await axios({
        method,
        url: `${this.config.apiUrl}${endpoint}`,
        data,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log successful response for debugging
      console.log('API Response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Error Response:', error.response?.data);
      console.error('Error Status:', error.response?.status);
      console.error('Error Headers:', error.response?.headers);
      
      // Log the full error object for debugging
      console.error('Full error object:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Request failed';
      const code = error.response?.data?.code || error.code;
      throw new SubscriptionError(message, code, error.response?.data);
    }
  }

  async createCheckoutSession(priceId: string): Promise<string> {
    try {
      console.log('Creating checkout session with price ID:', priceId);
      console.log('API endpoint:', SUBSCRIPTION_ENDPOINTS.CREATE_CHECKOUT);
      
      const requestData = { priceId };
      console.log('Request data:', requestData);
      console.log('Request data type:', typeof requestData);
      console.log('Price ID being sent:', priceId);
      console.log('Price ID type:', typeof priceId);
      
      const response = await this.makeAuthenticatedRequest<{ sessionId: string }>(
        'POST',
        SUBSCRIPTION_ENDPOINTS.CREATE_CHECKOUT,
        requestData
      );
      
      console.log('Checkout session response:', response);
      
      // Handle both direct sessionId and nested response structures
      const sessionId = response.sessionId || (response as any).sessionId;
      
      if (!sessionId) {
        console.error('No session ID in response:', response);
        throw new SubscriptionError('No session ID received from checkout creation', 'NO_SESSION_ID');
      }
      
      // Validate session ID format
      if (!sessionId.startsWith('cs_')) {
        console.error('Invalid session ID format:', sessionId);
        throw new SubscriptionError('Invalid session ID format received from server', 'INVALID_SESSION_ID_FORMAT');
      }
      
      console.log('Successfully extracted session ID:', sessionId);
      console.log('Session ID format validation: PASSED');
      
      // Test the session ID by constructing the checkout URL
      const testCheckoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;
      console.log('Test checkout URL:', testCheckoutUrl);
      
      return sessionId;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      if (error instanceof SubscriptionError) {
        throw error;
      }
      
      // Provide more specific error messages based on the error
      if (error.message?.includes('Invalid Stripe request')) {
        throw new SubscriptionError(
          `Invalid Stripe request. Please verify that price ID '${priceId}' exists in your Stripe account and is configured correctly.`,
          'INVALID_STRIPE_REQUEST'
        );
      }
      
      throw new SubscriptionError('Failed to create checkout session', 'CHECKOUT_ERROR', error);
    }
  }

  async redirectToCheckout(priceId: string): Promise<void> {
    try {
      // Validate price ID format
      if (!priceId || typeof priceId !== 'string') {
        throw new SubscriptionError('Invalid price ID provided', 'INVALID_PRICE_ID');
      }
      
      if (!priceId.startsWith('price_')) {
        throw new SubscriptionError(
          `Invalid price ID format: ${priceId}. Price IDs should start with 'price_'`,
          'INVALID_PRICE_ID_FORMAT'
        );
      }
      
      console.log('Creating checkout session for price ID:', priceId);
      const sessionId = await this.createCheckoutSession(priceId);
      console.log('Checkout session created successfully:', sessionId);
      
      // Dynamically import Stripe to reduce bundle size
      const { loadStripe } = await import('@stripe/stripe-js');
      
      if (!this.config.stripePublicKey) {
        throw new SubscriptionError('Stripe public key is not configured', 'STRIPE_CONFIG_ERROR');
      }
      
      // Validate Stripe public key format
      if (!this.config.stripePublicKey.startsWith('pk_')) {
        console.warn('Stripe public key does not start with "pk_". This might cause issues.');
      }
      
      console.log('Loading Stripe with public key:', this.config.stripePublicKey);
      const stripe = await loadStripe(this.config.stripePublicKey);
      
      if (!stripe) {
        throw new SubscriptionError('Failed to load Stripe', 'STRIPE_LOAD_ERROR');
      }
      
      console.log('Redirecting to Stripe checkout with session ID:', sessionId);
      console.log('Stripe instance:', stripe);
      console.log('Stripe public key used:', this.config.stripePublicKey);
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe redirect error:', error);
        throw new SubscriptionError(error.message || 'Checkout redirect failed', 'STRIPE_REDIRECT_ERROR');
      }
      
      console.log('Successfully redirected to Stripe checkout');
      console.log('Redirect completed - user should be on Stripe checkout page');
      
      // Add a fallback in case redirect doesn't work
      setTimeout(() => {
        console.log('Fallback: Checking if redirect worked...');
        // If we're still on the same page after 2 seconds, the redirect might have failed
        if (window.location.href.includes('resume-builder')) {
          console.warn('Redirect might have failed - user still on resume builder page');
          // Optionally show a manual link to the checkout
          const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;
          console.log('Manual checkout URL:', checkoutUrl);
        }
      }, 2000);
    } catch (error) {
      console.error('Error in redirectToCheckout:', error);
      if (error instanceof SubscriptionError) {
        throw error;
      }
      throw new SubscriptionError('Failed to redirect to checkout', 'REDIRECT_ERROR', error);
    }
  }

  async getSubscriptionStatus(forceRefresh: boolean = false): Promise<SubscriptionStatus> {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.isCacheValid() && this.subscriptionCache?.data) {
      return this.subscriptionCache.data;
    }

    try {
      const status = await this.makeAuthenticatedRequest<SubscriptionStatus>(
        'GET',
        SUBSCRIPTION_ENDPOINTS.SUBSCRIPTION_STATUS
      );
      
      // Validate response structure
      if (!status.planType) {
        throw new SubscriptionError('Invalid subscription status response', 'INVALID_RESPONSE');
      }
      
      // Cache the result
      this.subscriptionCache = {
        data: status,
        timestamp: Date.now()
      };
      
      return status;
    } catch (error) {
      if (error instanceof SubscriptionError) {
        // Log the error but don't throw to provide fallback
        console.error('Failed to fetch subscription status:', error);
      }
      
      // Return free tier as fallback
      const fallbackStatus = {
        planType: SUBSCRIPTION_PLANS.FREE,
        subscriptionStatus: undefined
      };
      
      // Cache the fallback (with shorter duration)
      this.subscriptionCache = {
        data: fallbackStatus,
        timestamp: Date.now() - (this.CACHE_DURATION - 30000) // Cache for only 30 seconds
      };
      
      return fallbackStatus;
    }
  }

  async cancelSubscription(): Promise<void> {
    try {
      await this.makeAuthenticatedRequest(
        'POST',
        SUBSCRIPTION_ENDPOINTS.CANCEL_SUBSCRIPTION
      );
      // Invalidate cache after subscription change
      this.invalidateCache();
    } catch (error) {
      throw new SubscriptionError('Failed to cancel subscription', 'CANCEL_ERROR', error);
    }
  }

  async resumeSubscription(): Promise<void> {
    try {
      await this.makeAuthenticatedRequest(
        'POST',
        SUBSCRIPTION_ENDPOINTS.RESUME_SUBSCRIPTION
      );
      // Invalidate cache after subscription change
      this.invalidateCache();
    } catch (error) {
      throw new SubscriptionError('Failed to resume subscription', 'RESUME_ERROR', error);
    }
  }

  isPremiumUser(status: SubscriptionStatus): boolean {
    return status.planType === SUBSCRIPTION_PLANS.PREMIUM && 
           status.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE;
  }
}

// Factory function to create subscription service
export const createSubscriptionService = (getAccessTokenSilently: () => Promise<string>) => {
  return new SubscriptionService(getAccessTokenSilently);
};

// Export types for convenience
export type { SubscriptionStatus, SubscriptionError } from '../types/subscription'; 