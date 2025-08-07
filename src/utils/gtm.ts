import TagManager from 'react-gtm-module';

// GTM Event Types
export interface GTMEvent {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Custom hook for GTM events
export const useGTM = () => {
  const pushEvent = (event: GTMEvent) => {
    TagManager.dataLayer({
      dataLayer: {
        ...event,
        timestamp: new Date().toISOString(),
      }
    });
  };

  const trackPageView = (page: string) => {
    pushEvent({
      event: 'page_view',
      page_path: page,
      page_title: document.title,
    });
  };

  const trackButtonClick = (buttonName: string, category: string = 'engagement') => {
    pushEvent({
      event: 'button_click',
      category,
      action: 'click',
      label: buttonName,
    });
  };

  const trackFormSubmission = (formName: string, success: boolean = true) => {
    pushEvent({
      event: 'form_submit',
      category: 'form',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
    });
  };

  const trackResumeAction = (action: string, template?: string, language?: string) => {
    pushEvent({
      event: 'resume_action',
      category: 'resume',
      action,
      label: template || 'default',
      language: language || 'en',
    });
  };

  const trackCoverLetterAction = (action: string, language?: string) => {
    pushEvent({
      event: 'cover_letter_action',
      category: 'cover_letter',
      action,
      language: language || 'en',
    });
  };

  const trackJobTrackerAction = (action: string) => {
    pushEvent({
      event: 'job_tracker_action',
      category: 'job_tracker',
      action,
    });
  };

  const trackSubscriptionAction = (action: string, plan?: string) => {
    pushEvent({
      event: 'subscription_action',
      category: 'subscription',
      action,
      label: plan || 'free',
    });
  };

  const trackAIEnhancement = (type: 'description' | 'summary', language: string, success: boolean) => {
    pushEvent({
      event: 'ai_enhancement',
      category: 'ai',
      action: success ? 'enhance_success' : 'enhance_error',
      label: type,
      language,
    });
  };

  return {
    pushEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmission,
    trackResumeAction,
    trackCoverLetterAction,
    trackJobTrackerAction,
    trackSubscriptionAction,
    trackAIEnhancement,
  };
};

// Helper function for tracking custom events
export const trackEvent = (event: GTMEvent) => {
  TagManager.dataLayer({
    dataLayer: {
      ...event,
      timestamp: new Date().toISOString(),
    }
  });
}; 