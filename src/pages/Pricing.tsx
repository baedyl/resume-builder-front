import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getCurrentPrice, isPromotionalPricingActive, STRIPE_PRICE_IDS } from '../constants/subscription';
import { useSubscription } from '../contexts/SubscriptionContext';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { upgradeToProduction } = useSubscription();
  const navigate = useNavigate();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleSubscribe = async (planName: string) => {
    if (planName === 'Basic') {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
      return;
    }

    if (!isAuthenticated) {
      await loginWithRedirect({
        appState: { returnTo: '/pricing' }
      });
      return;
    }

    if (planName === 'Professional') {
      try {
        setIsUpgrading(true);
        await upgradeToProduction(STRIPE_PRICE_IDS.PREMIUM_MONTHLY);
      } catch (error) {
        console.error('Upgrade failed:', error);
        setIsUpgrading(false);
        // You might want to show a toast notification here
      }
    }
    
    // For Exclusive plan or others without specific handling yet
    if (planName === 'Exclusive') {
       // Placeholder or contact sales logic
       navigate('/contact');
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: 0,
      description: 'Perfect for getting started with resume building',
      features: [
        'Resume generation',
        'Limited AI enhancement',
        'Basic templates',
        'PDF export',
        'Email support'
      ],
      limitations: [
        'No cover letter generation',
        'No job tracking',
        'No advanced templates',
        'No priority support'
      ],
      cta: 'Get Started Free',
      popular: false,
      trial: false
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? getCurrentPrice() : 249.99,
      description: 'Everything you need for your job search',
      features: [
        'Unlimited resume generation',
        'Unlimited AI enhancement',
        'All templates (Classic, Modern, Minimal)',
        'Cover letter generation',
        'Job application tracking',
        'PDF export',
        'Priority email support',
        'Resume analytics',
        'ATS optimization'
      ],
      limitations: [],
      cta: 'Upgrade Now',
      popular: true,
      trial: false
    },
    {
      name: 'Exclusive',
      price: billingCycle === 'monthly' ? 64.99 : 649.99,
      description: 'Complete career success package with personal assistance',
      features: [
        'Everything in Professional',
        'Personal career coaching',
        'Job search assistance',
        'Interview preparation',
        'Salary negotiation guidance',
        'Career path recommendations',
        '1-on-1 consultation calls',
        'Priority phone support',
        'Custom resume templates',
        'LinkedIn profile optimization'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      trial: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We have you covered, whether you're just starting your career, actively job hunting, 
              or looking for comprehensive career guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      {isPromotionalPricingActive() && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🎉</span>
              <span className="text-lg font-semibold">
                LIMITED TIME OFFER: 50% OFF Professional Plan
              </span>
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-sm mt-1 opacity-90">
              Get the Professional plan for just $12.50/month instead of $24.99/month. Offer ends soon!
            </p>
          </div>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    {plan.price === 0 ? (
                      <div>
                      <div className="text-4xl font-bold text-gray-900 dark:text-white">
                        Free
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Forever
                      </div>
                    </div>
                    ) : (
                      <div>
                        {plan.name === 'Professional' && billingCycle === 'monthly' && isPromotionalPricingActive() ? (
                          <div>
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                $12.50
                              </span>
                              <span className="text-lg text-gray-500 line-through">
                                $24.99
                              </span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              per month
                            </div>
                            <div className="mt-2">
                              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                50% OFF
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Limited time offer
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-4xl font-bold text-gray-900 dark:text-white">
                              ${plan.price}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                              per {billingCycle === 'monthly' ? 'month' : 'year'}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {plan.trial && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Start with 7 days for free
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={isUpgrading && plan.name === 'Professional'}
                    className={`w-full py-3 px-6 rounded-md font-medium transition-colors inline-block text-center ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : plan.price === 0
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } ${isUpgrading && plan.name === 'Professional' ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isUpgrading && plan.name === 'Professional' ? 'Processing...' : plan.cta}
                  </button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Plans Comparison
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Basic
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Professional
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                      Exclusive
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      Resume Generation
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      AI Enhancement
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">5/month</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">Unlimited</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">Unlimited</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      Cover Letter Generation
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      Job Tracking
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      All Templates
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      Personal Coaching
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      Job Search Assistance
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      Priority Support
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-600">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">Email</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600">Phone</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I use Resume Builder for free?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Our Basic plan is completely free and includes resume generation with limited AI enhancement. 
                You can create and download your resume without any cost.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards, debit cards, and PayPal. 
                All payments are processed securely through Stripe.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely. You can cancel your subscription at any time from your account settings. 
                You'll continue to have access until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to build your professional resume?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of professionals who have landed their dream jobs with our resume builder.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 