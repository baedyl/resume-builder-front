import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUS } from '../constants/subscription';

export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS];
export type SubscriptionStatusType = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

export interface SubscriptionStatus {
  planType: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatusType;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  subscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionContextType {
  subscription: SubscriptionStatus | null;
  isLoading: boolean;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToProduction: (priceId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
}

export interface SubscriptionServiceConfig {
  apiUrl: string;
  stripePublicKey: string;
}

export class SubscriptionError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SubscriptionError';
  }
} 