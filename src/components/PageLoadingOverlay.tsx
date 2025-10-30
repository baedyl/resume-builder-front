import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoadingOverlay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);

    // Hide loader after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Also handle initial page load
  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      setIsLoading(true);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="relative">
        {/* Animated circles */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* Optional text */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoadingOverlay;

