import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

const NotificationSettings = () => {
  const { permission, enabled, enableNotifications, disableNotifications } = useNotifications();

  const handleToggle = async () => {
    if (enabled) {
      disableNotifications();
      toast.success('Notifications disabled');
    } else {
      const granted = await enableNotifications();
      if (!granted) {
        toast.error('Please allow notifications in your browser settings');
      }
    }
  };

  if (!('Notification' in window)) {
    return null; // Don't show if browser doesn't support notifications
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 safe-area-inset-bottom">
      <Button
        onClick={handleToggle}
        variant={enabled ? "default" : "secondary"}
        size="lg"
        className="shadow-lg rounded-full h-14 w-14 p-0 touch-manipulation"
        title={enabled ? "Notifications enabled (9 PM daily)" : "Enable notifications (9 PM daily reminder)"}
        aria-label={enabled ? "Disable notifications" : "Enable notifications"}
      >
        {enabled ? (
          <Bell className="h-6 w-6" />
        ) : (
          <BellOff className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default NotificationSettings;