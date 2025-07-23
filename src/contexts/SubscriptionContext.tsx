import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createSubscriptionService, SubscriptionStatus } from '../services/subscriptionService';

interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToProduction: (priceId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const subscriptionService = createSubscriptionService(getAccessTokenSilently);

  const refreshSubscription = async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const status = await subscriptionService.getSubscriptionStatus();
      console.log('Subscription status received:', status);
      setSubscription(status);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      // Set to free tier on error
      setSubscription({
        planType: 'free',
        subscriptionStatus: undefined
      });
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToProduction = async (priceId: string) => {
    try {
      await subscriptionService.redirectToCheckout(priceId);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    try {
      await subscriptionService.cancelSubscription();
      await refreshSubscription(); // Refresh to get updated status
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  };

  const resumeSubscription = async () => {
    try {
      await subscriptionService.resumeSubscription();
      await refreshSubscription(); // Refresh to get updated status
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [isAuthenticated]);

  const isPremium = subscription?.planType === 'premium' && subscription?.subscriptionStatus === 'active';
  
  console.log('Current subscription:', subscription);
  console.log('Is premium calculated:', isPremium);

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    isPremium,
    refreshSubscription,
    upgradeToProduction,
    cancelSubscription,
    resumeSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 