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
  PREMIUM_MONTHLY: 'price_1Rj0WsClD8P2gKzIoEThGR9o'
} as const;

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
  CANCEL_SUBSCRIPTION: '/api/stripe/cancel-subscription',
  RESUME_SUBSCRIPTION: '/api/stripe/resume-subscription'
} as const; 