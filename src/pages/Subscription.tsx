import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { FaCrown, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

  const handleUpgrade = async () => {
    try {
      setActionLoading(true);
      await upgradeToProduction('price_1Rj0WsClD8P2gKzIoEThGR9o');
    } catch (error) {
      toast.error('Failed to upgrade subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      setActionLoading(true);
      await cancelSubscription();
      toast.success('Subscription canceled successfully');
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setActionLoading(true);
      await resumeSubscription();
      toast.success('Subscription resumed successfully');
    } catch (error) {
      toast.error('Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const features = [
    'AI Cover Letter Generation',
    'Advanced Job Application Tracking',
    'Resume Enhancement for Job Applications',
    'Priority Customer Support',
    'Export to Multiple Formats',
    'Unlimited Resume Templates'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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

        {/* Current Status */}
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

          {subscription && isPremium && (
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {subscription.subscriptionEnd && (
                <p>
                  Next billing date: {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                </p>
              )}
              {subscription.cancelAtPeriodEnd && (
                <p className="text-orange-600 dark:text-orange-400">
                  Your subscription will cancel at the end of the current period.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pricing Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Premium Plan</h3>
              <div className="text-white">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-sm opacity-75">/month</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <FaCheck className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              {!isPremium ? (
                <button
                  onClick={handleUpgrade}
                  disabled={actionLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCrown className="inline mr-2" />
                      Upgrade to Premium
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

        {/* Feature Comparison */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Plan Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 text-gray-700 dark:text-gray-300">Feature</th>
                  <th className="text-center py-2 text-gray-700 dark:text-gray-300">Free</th>
                  <th className="text-center py-2 text-gray-700 dark:text-gray-300">Premium</th>
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
                  <td className="text-center py-3">3 templates</td>
                  <td className="text-center py-3">Unlimited</td>
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