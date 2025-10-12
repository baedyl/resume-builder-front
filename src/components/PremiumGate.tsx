import { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { FaCrown, FaLock, FaSpinner } from 'react-icons/fa';
import { STRIPE_PRICE_IDS, getPriceDisplayText, isPromotionalPricingActive, getPriceIdInfo, getDebugInfo, debugPriceId } from '../constants/subscription';
import { SubscriptionError } from '../types/subscription';
import { toast } from 'react-toastify';
import LoadingOverlay from './LoadingOverlay';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
  showPreview?: boolean;
  // Optional: force gate even if user is premium (e.g., expired subscription)
  forceGate?: boolean;
  gateTitle?: string;
  gateMessage?: string;
  upgradeUrl?: string; // optional custom upgrade/renew URL
}

const PremiumGate: React.FC<PremiumGateProps> = ({ 
  children, 
  feature, 
  description,
  showPreview = true,
  forceGate = false,
  gateTitle,
  gateMessage,
  upgradeUrl,
}) => {
  const { isPremium, isLoading, upgradeToProduction } = useSubscription();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async (): Promise<void> => {
    try {
      setUpgrading(true);
      
      // Log price ID information for debugging
      const priceInfo = getPriceIdInfo();
      console.log('Price ID info:', priceInfo);
      console.log('Starting upgrade process with price ID:', STRIPE_PRICE_IDS.PREMIUM_MONTHLY);
      
      // Debug price configuration
      debugPriceId();
      
      console.log('Calling upgradeToProduction...');
      await upgradeToProduction(STRIPE_PRICE_IDS.PREMIUM_MONTHLY);
      console.log('Upgrade process completed successfully');
      
      // Don't show error toast on success - the redirect should happen automatically
      console.log('No error occurred - redirect should be in progress');
      
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);
      
      let message = 'Failed to upgrade subscription. Please try again.';
      
      if (error instanceof SubscriptionError) {
        message = error.message;
        console.log('SubscriptionError caught:', error.message);
      } else if (error instanceof Error) {
        message = error.message;
        console.log('Generic Error caught:', error.message);
      } else {
        console.log('Unknown error type:', error);
      }
      
      toast.error(message);
    } finally {
      setUpgrading(false);
    }
  };

  // Show loading state using standardized LoadingOverlay
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Allow premium users full access
  if (isPremium && !forceGate) {
    return <>{children}</>;
  }

  // Debug information (remove this in production)
  const debugInfo = getDebugInfo();
  console.log('PremiumGate Debug Info:', debugInfo);

  // Premium gate for non-premium users
  return (
    <div className="relative" role="region" aria-label={`Premium feature: ${feature}`}>
      {/* Content preview with blur effect */}
      {showPreview && (
        <div className="relative">
          <div className="filter blur-sm pointer-events-none opacity-50 select-none">
            {children}
          </div>
        </div>
      )}
      
      {/* Premium overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-sm flex items-center justify-center min-h-[550px]`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md mx-4 text-center shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Premium icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaCrown className="text-5xl text-yellow-500 drop-shadow-lg" />
              <FaLock className="text-lg text-gray-600 absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1" />
            </div>
          </div>
          
          {/* Content */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {gateTitle || 'Premium Feature'}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
            {gateMessage ? (
              <span>{gateMessage}</span>
            ) : (
              <span><strong>{feature}</strong> requires a premium subscription.</span>
            )}
          </p>
          
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              {description}
            </p>
          )}
          
          {/* Upgrade button */}
          <div className="space-y-4">
            <button
              onClick={() => {
                const isExpiredContext = !!(forceGate && (
                  (gateTitle && gateTitle.toLowerCase().includes('expired')) ||
                  (gateMessage && gateMessage.toLowerCase().includes('expired'))
                ));
                // For expired subscriptions, ALWAYS launch checkout directly
                if (isExpiredContext) {
                  handleUpgrade();
                  return;
                }
                // Otherwise, if a specific upgradeUrl was provided, use it; fallback to checkout
                if (upgradeUrl) {
                  try { window.location.assign(upgradeUrl); } catch { window.location.href = upgradeUrl; }
                  return;
                }
                handleUpgrade();
              }}
              disabled={upgrading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-label={upgrading ? 'Processing upgrade...' : 'Upgrade to Premium'}
            >
              {upgrading ? (
                <>
                  <FaSpinner className="animate-spin inline mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCrown className="inline mr-2" />
                  {gateTitle?.toLowerCase().includes('expired') ? 'Renew Subscription' : 'Upgrade to Premium'}
                </>
              )}
            </button>
            
            {/* Pricing info */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p className={isPromotionalPricingActive() ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                {getPriceDisplayText()}
              </p>
              <p>Cancel anytime • Instant access to all features</p>
              {isPromotionalPricingActive() && (
                <p className="text-green-600 dark:text-green-400 font-medium">
                  🎉 Limited time offer until October 30th!
                </p>
              )}
            </div>
          </div>
          
          {/* Features teaser */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Premium includes:
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div>✨ AI-powered tools</div>
              <div>📊 Advanced analytics</div>
              <div>🎯 Priority support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate; 