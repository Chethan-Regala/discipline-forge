import { useEffect, useState, useCallback } from 'react';

interface NotificationState {
  permission: NotificationPermission;
  enabled: boolean;
}

const NOTIFICATION_TIME = 21; // 9 PM in 24-hour format
const NOTIFICATION_STORAGE_KEY = 'discipline-os-notifications-enabled';

export const useNotifications = () => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    permission: 'default',
    enabled: false,
  });

  // Check notification permission and saved preference
  useEffect(() => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      const savedEnabled = localStorage.getItem(NOTIFICATION_STORAGE_KEY) === 'true';
      
      setNotificationState({
        permission,
        enabled: savedEnabled && permission === 'granted',
      });
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setNotificationState({ permission: 'granted', enabled: true });
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true');
      return true;
    }

    if (Notification.permission === 'denied') {
      alert('Notifications are blocked. Please enable them in your browser settings.');
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    
    setNotificationState({ 
      permission, 
      enabled: granted 
    });
    
    if (granted) {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true');
    }
    
    return granted;
  }, []);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      // Send a test notification
      showNotification('Notifications Enabled!', {
        body: 'You will receive a reminder at 9 PM every day to track your habits.',
        icon: '/favicon.ico',
        tag: 'notification-enabled',
      });
    }
    return granted;
  }, [requestPermission]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'false');
    setNotificationState(prev => ({ ...prev, enabled: false }));
  }, []);

  // Show notification
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  }, []);

  // Schedule daily notification at 9 PM
  useEffect(() => {
    if (!notificationState.enabled || Notification.permission !== 'granted') {
      return;
    }

    const scheduleNotification = () => {
      const now = new Date();
      const notificationTime = new Date();
      notificationTime.setHours(NOTIFICATION_TIME, 0, 0, 0);

      // If 9 PM has passed today, schedule for tomorrow
      if (now >= notificationTime) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      const timeUntilNotification = notificationTime.getTime() - now.getTime();

      const timeoutId = setTimeout(() => {
        showNotification('Time to Track Your Habits! 📊', {
          body: 'Don\'t forget to log your daily habits and reflection before the day ends.',
          tag: 'daily-reminder',
          requireInteraction: false,
        });

        // Schedule next day's notification
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(NOTIFICATION_TIME, 0, 0, 0);
        const nextDayTime = nextDay.getTime() - Date.now();
        
        setTimeout(() => {
          scheduleNotification();
        }, nextDayTime);
      }, timeUntilNotification);

      return () => clearTimeout(timeoutId);
    };

    const timeoutId = scheduleNotification();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [notificationState.enabled, showNotification]);

  return {
    ...notificationState,
    requestPermission,
    enableNotifications,
    disableNotifications,
    showNotification,
  };
};


