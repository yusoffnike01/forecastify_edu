import { logEvent, isSupported } from "firebase/analytics";
import { analytics } from "./config";

// Custom analytics functions for your app
export const logPageView = (pageName) => {
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && analytics) {
        logEvent(analytics, 'page_view', {
          page_title: pageName,
          page_location: window.location.href
        });
      }
    });
  }
};

export const logButtonClick = (buttonName, location) => {
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && analytics) {
        logEvent(analytics, 'select_content', {
          content_type: 'button',
          content_id: buttonName,
          custom_location: location
        });
      }
    });
  }
};

export const logFeatureView = (featureName) => {
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && analytics) {
        logEvent(analytics, 'view_item', {
          item_id: featureName,
          item_name: featureName,
          item_category: 'feature'
        });
      }
    });
  }
};

export const logCalculation = (dataPoints, forecastPeriods) => {
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && analytics) {
        logEvent(analytics, 'generate_lead', {
          currency: 'USD',
          value: dataPoints,
          custom_parameter_1: forecastPeriods
        });
      }
    });
  }
};

export const logUserEngagement = (engagementType, duration) => {
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && analytics) {
        logEvent(analytics, 'user_engagement', {
          engagement_time_msec: duration,
          engagement_type: engagementType
        });
      }
    });
  }
};