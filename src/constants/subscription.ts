import { getApiUrl, getStripePublicKey } from '../utils/api';

// Subscription plan configuration
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium'
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'canceled',
  PAST_DUE: 'past_due',
  INCOMPLETE: 'incomplete'
} as const;

// Stripe price IDs
export const STRIPE_PRICE_IDS = {
  PREMIUM_MONTHLY: 'price_1RqG24BfzIcY9By9KVsHQFwt'
} as const;

// Note: This price ID should correspond to the promotional price ($12.50)
// If you have a separate price ID for the promotional price, update it here

// Debug function to check price ID
export const debugPriceId = () => {
  console.log('Current price ID:', STRIPE_PRICE_IDS.PREMIUM_MONTHLY);
  console.log('Promotional pricing active:', isPromotionalPricingActive());
  console.log('Current price should be:', getCurrentPrice());
  console.log('Price display text:', getPriceDisplayText());
};

// Helper function to validate price ID
export const validatePriceId = (priceId: string): boolean => {
  return priceId && typeof priceId === 'string' && priceId.startsWith('price_');
};

// Helper function to get price ID info for debugging
export const getPriceIdInfo = (): { priceId: string; isValid: boolean } => {
  const priceId = STRIPE_PRICE_IDS.PREMIUM_MONTHLY;
  return {
    priceId,
    isValid: validatePriceId(priceId)
  };
};

// Helper function to get debugging information
export const getDebugInfo = () => {
  return {
    priceId: STRIPE_PRICE_IDS.PREMIUM_MONTHLY,
    priceIdValid: validatePriceId(STRIPE_PRICE_IDS.PREMIUM_MONTHLY),
    apiUrl: getApiUrl(),
    stripePublicKey: getStripePublicKey() ? 'Configured' : 'Not configured',
    promotionalPricing: {
      isActive: isPromotionalPricingActive(),
      promotionalPrice: PROMOTIONAL_PRICING.PROMOTIONAL_PRICE,
      regularPrice: PROMOTIONAL_PRICING.REGULAR_PRICE
    }
  };
};

// Promotional pricing configuration
export const PROMOTIONAL_PRICING = {
  START_DATE: new Date('2025-07-07'), // Set to a past date to enable promotion
  END_DATE: new Date('2025-10-30'),
  PROMOTIONAL_PRICE: 12.50, // 50% off $12.50
  REGULAR_PRICE: 12.50
} as const;

// Function to check if promotional pricing is active
export const isPromotionalPricingActive = (): boolean => {
  const now = new Date();
  return now >= PROMOTIONAL_PRICING.START_DATE && now <= PROMOTIONAL_PRICING.END_DATE;
};

// Function to get current price
export const getCurrentPrice = (): number => {
  return isPromotionalPricingActive() ? PROMOTIONAL_PRICING.PROMOTIONAL_PRICE : PROMOTIONAL_PRICING.REGULAR_PRICE;
};

// Function to get price display text
export const getPriceDisplayText = (): string => {
  const currentPrice = getCurrentPrice();
  const isPromo = isPromotionalPricingActive();
  
  if (isPromo) {
    return `Limited Time: $${currentPrice}/month (Regular $${PROMOTIONAL_PRICING.REGULAR_PRICE}/month)`;
  }
  
  return `Starting at $${currentPrice}/month`;
};

// Premium features list
export const PREMIUM_FEATURES = [
  'AI Cover Letter Generation',
  'Advanced Job Application Tracking',
  'Resume Enhancement for Job Applications',
  'Priority Customer Support',
  'Export to Multiple Formats',
  'Unlimited Resume Templates'
] as const;

// Feature descriptions for premium gates
export const FEATURE_DESCRIPTIONS = {
  COVER_LETTERS: 'Generate AI-powered cover letters tailored to specific job descriptions and enhance your application success rate.',
  JOB_TRACKER: 'Track your job applications, manage deadlines, follow-ups, and get insights into your job search progress with detailed analytics.',
  RESUME_ENHANCEMENT: 'Get your resume optimized by AI for specific job descriptions. Improve your chances with ATS-friendly keywords and tailored content.'
} as const;

// API endpoints
export const SUBSCRIPTION_ENDPOINTS = {
  CREATE_CHECKOUT: '/api/stripe/create-checkout-session',
  SUBSCRIPTION_STATUS: '/api/stripe/subscription-status',
  SUBSCRIPTION_DEBUG: '/api/stripe/debug-subscription',
  CANCEL_SUBSCRIPTION: '/api/stripe/cancel-subscription',
  RESUME_SUBSCRIPTION: '/api/stripe/resume-subscription'
} as const; 