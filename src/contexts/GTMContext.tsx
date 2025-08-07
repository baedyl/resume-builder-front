import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGTM } from '../utils/gtm';

interface GTMContextType {
  trackPageView: (page: string) => void;
  trackButtonClick: (buttonName: string, category?: string) => void;
  trackFormSubmission: (formName: string, success?: boolean) => void;
  trackResumeAction: (action: string, template?: string, language?: string) => void;
  trackCoverLetterAction: (action: string, language?: string) => void;
  trackJobTrackerAction: (action: string) => void;
  trackSubscriptionAction: (action: string, plan?: string) => void;
  trackAIEnhancement: (type: 'description' | 'summary', language: string, success: boolean) => void;
  pushEvent: (event: any) => void;
}

const GTMContext = createContext<GTMContextType | undefined>(undefined);

export const useGTMContext = () => {
  const context = useContext(GTMContext);
  if (!context) {
    throw new Error('useGTMContext must be used within a GTMProvider');
  }
  return context;
};

interface GTMProviderProps {
  children: React.ReactNode;
}

export const GTMProvider: React.FC<GTMProviderProps> = ({ children }) => {
  const location = useLocation();
  const gtm = useGTM();

  // Track page views automatically
  useEffect(() => {
    gtm.trackPageView(location.pathname);
  }, [location.pathname, gtm]);

  const value: GTMContextType = {
    trackPageView: gtm.trackPageView,
    trackButtonClick: gtm.trackButtonClick,
    trackFormSubmission: gtm.trackFormSubmission,
    trackResumeAction: gtm.trackResumeAction,
    trackCoverLetterAction: gtm.trackCoverLetterAction,
    trackJobTrackerAction: gtm.trackJobTrackerAction,
    trackSubscriptionAction: gtm.trackSubscriptionAction,
    trackAIEnhancement: gtm.trackAIEnhancement,
    pushEvent: gtm.pushEvent,
  };

  return (
    <GTMContext.Provider value={value}>
      {children}
    </GTMContext.Provider>
  );
}; 