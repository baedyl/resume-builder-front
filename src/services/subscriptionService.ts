import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export interface SubscriptionStatus {
  planType: 'free' | 'premium';
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'incomplete';
  subscriptionStart?: string;
  subscriptionEnd?: string;
  subscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
}

export const createSubscriptionService = (getAccessTokenSilently: () => Promise<string>) => {
  return {
    // Create Stripe checkout session
    async createCheckoutSession(priceId: string): Promise<string> {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.post(
          `${API_URL}/api/stripe/create-checkout-session`,
          { priceId },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        return response.data.sessionId;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new Error('Failed to create checkout session');
      }
    },

    // Redirect to Stripe Checkout
    async redirectToCheckout(priceId: string): Promise<void> {
      try {
        const sessionId = await this.createCheckoutSession(priceId);
        
        // Dynamically import Stripe
        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
        
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }
        
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          throw new Error(error.message);
        }
      } catch (error) {
        console.error('Error redirecting to checkout:', error);
        throw error;
      }
    },

    // Check subscription status
    async getSubscriptionStatus(): Promise<SubscriptionStatus> {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${API_URL}/api/stripe/subscription-status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Error checking subscription status:', error);
        // Return free tier as fallback
        return {
          planType: 'free',
          subscriptionStatus: undefined
        };
      }
    },

    // Cancel subscription
    async cancelSubscription(): Promise<void> {
      try {
        const token = await getAccessTokenSilently();
        await axios.post(
          `${API_URL}/api/stripe/cancel-subscription`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error('Error canceling subscription:', error);
        throw new Error('Failed to cancel subscription');
      }
    },

    // Resume subscription
    async resumeSubscription(): Promise<void> {
      try {
        const token = await getAccessTokenSilently();
        await axios.post(
          `${API_URL}/api/stripe/resume-subscription`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } catch (error) {
        console.error('Error resuming subscription:', error);
        throw new Error('Failed to resume subscription');
      }
    },

    // Check if user has premium access
    async isPremiumUser(): Promise<boolean> {
      const status = await this.getSubscriptionStatus();
      return status.planType === 'premium' && status.subscriptionStatus === 'active';
    }
  };
}; 