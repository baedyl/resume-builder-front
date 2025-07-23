import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { FaCrown, FaLock } from 'react-icons/fa';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description?: string;
}

const PremiumGate: React.FC<PremiumGateProps> = ({ children, feature, description }) => {
  const { isPremium, isLoading, upgradeToProduction } = useSubscription();

  const handleUpgrade = async () => {
    try {
      // Use the premium monthly price ID - this should match your Stripe price ID
      await upgradeToProduction('price_1Rj0WsClD8P2gKzIoEThGR9o');
    } catch (error) {
      console.error('Error upgrading to premium:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content overlay */}
      <div className="relative">
        <div className="filter blur-sm pointer-events-none opacity-50">
          {children}
        </div>
        
        {/* Premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <FaCrown className="text-4xl text-yellow-500" />
                <FaLock className="text-lg text-gray-600 absolute -bottom-1 -right-1" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Premium Feature
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              <strong>{feature}</strong> is a premium feature.
            </p>
            
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {description}
              </p>
            )}
            
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <FaCrown className="inline mr-2" />
                Upgrade to Premium
              </button>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Unlock all premium features with our monthly subscription
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate; 