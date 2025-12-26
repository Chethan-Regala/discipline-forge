import { useEffect, useState, useCallback, useRef } from 'react';

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Clear existing timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Show notification with professional styling
  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (Notification.permission !== 'granted') {
      return null;
    }
    
    try {
      const notification = new Notification(title, {
        icon: '/og-image.png',
        badge: '/og-image.png',
        image: '/og-image.png',
        requireInteraction: false,
        silent: false,
        timestamp: Date.now(),
        ...options,
      });
      
      // Professional behavior: auto-close after 8 seconds
      setTimeout(() => {
        notification.close();
      }, 8000);
      
      // Focus app when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      return notification;
    } catch (error) {
      return null;
    }
  }, []);

  // Enable notifications
  const enableNotifications = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'true');
      setNotificationState({ permission: 'granted', enabled: true });
      
      // Professional welcome notification
      showNotification('Discipline OS', {
        body: 'Daily reminders enabled. You\'ll get notified at 9 PM.',
        tag: 'welcome',
      });
    }
    return granted;
  }, [requestPermission, showNotification]);

  // Disable notifications
  const disableNotifications = useCallback(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, 'false');
    setNotificationState(prev => ({ ...prev, enabled: false }));
    clearTimers();
  }, [clearTimers]);

  // Schedule daily notifications with precision
  useEffect(() => {
    clearTimers();
    
    if (!notificationState.enabled || Notification.permission !== 'granted') {
      return;
    }

    const scheduleNotification = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(NOTIFICATION_TIME, 0, 0, 0);
      
      // If past 9 PM today, schedule for tomorrow
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }
      
      const delay = target.getTime() - now.getTime();
      
      timeoutRef.current = setTimeout(() => {
        // Professional daily reminder
        showNotification('Discipline OS', {
          body: 'Time to track your daily habits and reflect on your progress.',
          tag: 'daily-reminder',
          requireInteraction: true,
        });
        
        // Schedule next day
        scheduleNotification();
      }, delay);
    };

    scheduleNotification();

    return clearTimers;
  }, [notificationState.enabled, showNotification, clearTimers]);

  return {
    ...notificationState,
    requestPermission,
    enableNotifications,
    disableNotifications,
    showNotification,
  };
};