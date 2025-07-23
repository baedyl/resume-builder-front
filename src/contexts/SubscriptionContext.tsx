import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createSubscriptionService } from '../services/subscriptionService';
import { 
  SubscriptionStatus, 
  SubscriptionContextType, 
  SubscriptionError 
} from '../types/subscription';
import { SUBSCRIPTION_PLANS } from '../constants/subscription';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = (): SubscriptionContextType => {
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
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  // Create service instance only once
  const subscriptionService = useMemo(() => {
    if (!isAuthenticated) return null;
    return createSubscriptionService(getAccessTokenSilently);
  }, [getAccessTokenSilently, isAuthenticated]);

  const refreshSubscription = useCallback(async (): Promise<void> => {
    if (!isAuthenticated || !subscriptionService) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      // Set to free tier on error - service already handles fallback
      setSubscription({
        planType: SUBSCRIPTION_PLANS.FREE,
        subscriptionStatus: undefined
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, subscriptionService]);

  const upgradeToProduction = useCallback(async (priceId: string): Promise<void> => {
    if (!subscriptionService) {
      throw new SubscriptionError('Subscription service not available', 'SERVICE_UNAVAILABLE');
    }

    try {
      await subscriptionService.redirectToCheckout(priceId);
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }
      throw new SubscriptionError('Failed to upgrade subscription', 'UPGRADE_ERROR', error);
    }
  }, [subscriptionService]);

  const cancelSubscription = useCallback(async (): Promise<void> => {
    if (!subscriptionService) {
      throw new SubscriptionError('Subscription service not available', 'SERVICE_UNAVAILABLE');
    }

    try {
      await subscriptionService.cancelSubscription();
      await refreshSubscription(); // Refresh to get updated status
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }
      throw new SubscriptionError('Failed to cancel subscription', 'CANCEL_ERROR', error);
    }
  }, [subscriptionService, refreshSubscription]);

  const resumeSubscription = useCallback(async (): Promise<void> => {
    if (!subscriptionService) {
      throw new SubscriptionError('Subscription service not available', 'SERVICE_UNAVAILABLE');
    }

    try {
      await subscriptionService.resumeSubscription();
      await refreshSubscription(); // Refresh to get updated status
    } catch (error) {
      if (error instanceof SubscriptionError) {
        throw error;
      }
      throw new SubscriptionError('Failed to resume subscription', 'RESUME_ERROR', error);
    }
  }, [subscriptionService, refreshSubscription]);

  // Only refresh subscription when authentication status changes or user changes
  useEffect(() => {
    refreshSubscription();
  }, [isAuthenticated, user?.sub]); // Use user.sub to detect user changes

  // Calculate premium status using service method for consistency
  const isPremium = useMemo(() => {
    if (!subscription || !subscriptionService) return false;
    return subscriptionService.isPremiumUser(subscription);
  }, [subscription, subscriptionService]);

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