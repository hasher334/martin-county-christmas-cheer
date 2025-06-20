
import { supabase } from "@/integrations/supabase/client";

interface BaseNotification {
  type: string;
  timestamp?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface UserSignupNotification extends BaseNotification {
  type: 'user_signup';
  userEmail: string;
  userName?: string;
}

interface AuthEventNotification extends BaseNotification {
  type: 'auth_event';
  eventType: string;
  userEmail: string;
  eventDescription?: string;
}

interface AnalyticsSummaryNotification extends BaseNotification {
  type: 'analytics_summary';
  analyticsData: {
    pageViews?: number;
    uniqueVisitors?: number;
    newRegistrations?: number;
    adoptions?: number;
    contactForms?: number;
    period?: string;
  };
}

interface SystemEventNotification extends BaseNotification {
  type: 'system_event';
  systemEventType: string;
  eventDescription?: string;
  data?: any;
}

interface AdminActivityNotification extends BaseNotification {
  type: 'admin_activity';
  adminUser: string;
  adminAction: string;
  eventDescription?: string;
  data?: any;
}

type NotificationRequest = UserSignupNotification | AuthEventNotification | AnalyticsSummaryNotification | SystemEventNotification | AdminActivityNotification;

export const sendNotification = async (notification: NotificationRequest) => {
  try {
    // Add current timestamp if not provided
    if (!notification.timestamp) {
      notification.timestamp = new Date().toISOString();
    }

    console.log(`Sending ${notification.type} notification:`, notification);

    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: notification
    });

    if (error) {
      console.error('Error sending notification:', error);
      throw error;
    }

    console.log('Notification sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send notification:', error);
    return { success: false, error };
  }
};

// Convenience functions for specific notification types
export const notifyUserSignup = (userEmail: string, userName?: string, ipAddress?: string) => {
  return sendNotification({
    type: 'user_signup',
    userEmail,
    userName,
    ipAddress,
    userAgent: navigator.userAgent
  });
};

export const notifyAuthEvent = (eventType: string, userEmail: string, eventDescription?: string, ipAddress?: string) => {
  return sendNotification({
    type: 'auth_event',
    eventType,
    userEmail,
    eventDescription,
    ipAddress,
    userAgent: navigator.userAgent
  });
};

export const notifyAnalyticsSummary = (analyticsData: any) => {
  return sendNotification({
    type: 'analytics_summary',
    analyticsData
  });
};

export const notifySystemEvent = (systemEventType: string, eventDescription?: string, data?: any) => {
  return sendNotification({
    type: 'system_event',
    systemEventType,
    eventDescription,
    data
  });
};

export const notifyAdminActivity = (adminUser: string, adminAction: string, eventDescription?: string, data?: any, ipAddress?: string) => {
  return sendNotification({
    type: 'admin_activity',
    adminUser,
    adminAction,
    eventDescription,
    data,
    ipAddress,
    userAgent: navigator.userAgent
  });
};
