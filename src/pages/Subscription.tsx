import { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { FaCrown, FaCheck, FaTimes, FaSpinner, FaCalendar, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PREMIUM_FEATURES, STRIPE_PRICE_IDS, getCurrentPrice, isPromotionalPricingActive } from '../constants/subscription';
import { SubscriptionError } from '../types/subscription';
import LoadingOverlay from '../components/LoadingOverlay';

const Subscription: React.FC = () => {
  const { 
    subscription, 
    isPremium, 
    isLoading, 
    upgradeToProduction, 
    cancelSubscription, 
    resumeSubscription 
  } = useSubscription();
  
  const [actionLoading, setActionLoading] = useState(false);
  const now = new Date();
  const subscriptionEndDate = subscription?.subscriptionEnd ? new Date(subscription.subscriptionEnd) : null;
  const isExpired = Boolean(subscriptionEndDate && subscriptionEndDate.getTime() < now.getTime());

  const handleUpgrade = async (): Promise<void> => {
    try {
      setActionLoading(true);
      await upgradeToProduction(STRIPE_PRICE_IDS.PREMIUM_MONTHLY);
    } catch (error) {
      const message = error instanceof SubscriptionError 
        ? error.message 
        : 'Failed to upgrade subscription. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (): Promise<void> => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.'
    );
    
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await cancelSubscription();
      toast.success('Subscription canceled successfully. You\'ll retain access until your billing period ends.');
    } catch (error) {
      const message = error instanceof SubscriptionError 
        ? error.message 
        : 'Failed to cancel subscription. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async (): Promise<void> => {
    try {
      setActionLoading(true);
      await resumeSubscription();
      toast.success('Subscription resumed successfully!');
    } catch (error) {
      const message = error instanceof SubscriptionError 
        ? error.message 
        : 'Failed to resume subscription. Please try again.';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Subscription Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your subscription and unlock premium features
          </p>
        </div>

        {/* Current Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Current Plan
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPremium 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {isPremium ? (
                <>
                  <FaCrown className="inline mr-1" />
                  Premium
                </>
              ) : (
                'Free'
              )}
            </div>
          </div>

          {/* Subscription Details */}
          {subscription && isPremium && (
            <div className="space-y-3 text-sm">
              {subscription.subscriptionEnd && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <FaCalendar className="mr-2" />
                  <span>Next billing date: {formatDate(subscription.subscriptionEnd)}</span>
                </div>
              )}
              
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center text-orange-600 dark:text-orange-400">
                  <FaExclamationTriangle className="mr-2" />
                  <span>Your subscription will cancel at the end of the current period.</span>
                </div>
              )}
              
              {subscription.subscriptionStart && (
                <div className="text-gray-500 dark:text-gray-500 text-xs">
                  Premium since: {formatDate(subscription.subscriptionStart)}
                </div>
              )}
            </div>
          )}

          {/* Expired banner */}
          {isExpired && (
            <div className="mt-4 p-3 rounded bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200">
              Your subscription expired on {formatDate(subscription!.subscriptionEnd!)}.
              <div className="mt-2">
                <button
                  onClick={handleUpgrade}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Renew Subscription'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Premium Plan</h3>
              <div className="text-white">
                <span className="text-3xl font-bold">${getCurrentPrice()}</span>
                <span className="text-sm opacity-75">/month</span>
                {isPromotionalPricingActive() && (
                  <div className="text-xs mt-1">
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-medium">
                      🎉 Limited Time Offer!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Features List */}
            <ul className="space-y-3 mb-6">
              {PREMIUM_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <FaCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="space-y-3">
            {!isPremium ? (
                <button
                  onClick={handleUpgrade}
                  disabled={actionLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCrown className="inline mr-2" />
                    {isExpired ? 'Renew Subscription' : 'Upgrade to Premium'}
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  {subscription?.cancelAtPeriodEnd ? (
                    <button
                      onClick={handleResume}
                      disabled={actionLoading}
                      className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin inline mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Resume Subscription'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <>
                          <FaSpinner className="animate-spin inline mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaTimes className="inline mr-2" />
                          Cancel Subscription
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 text-gray-700 dark:text-gray-300 font-medium">Feature</th>
                  <th className="text-center py-3 text-gray-700 dark:text-gray-300 font-medium">Free</th>
                  <th className="text-center py-3 text-gray-700 dark:text-gray-300 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Basic Resume Builder</td>
                  <td className="text-center py-3"><FaCheck className="inline text-green-500" /></td>
                  <td className="text-center py-3"><FaCheck className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Resume Templates</td>
                  <td className="text-center py-3 text-gray-500">3 templates</td>
                  <td className="text-center py-3 text-green-600 font-medium">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-700 dark:text-gray-300">AI Cover Letter Generation</td>
                  <td className="text-center py-3"><FaTimes className="inline text-red-500" /></td>
                  <td className="text-center py-3"><FaCheck className="inline text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 text-gray-700 dark:text-gray-300">Job Application Tracking</td>
                  <td className="text-center py-3"><FaTimes className="inline text-red-500" /></td>
                  <td className="text-center py-3"><FaCheck className="inline text-green-500" /></td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700 dark:text-gray-300">AI Resume Enhancement</td>
                  <td className="text-center py-3"><FaTimes className="inline text-red-500" /></td>
                  <td className="text-center py-3"><FaCheck className="inline text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription; 