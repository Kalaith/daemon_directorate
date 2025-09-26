// components/ui/NotificationSystem.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to add a notification (can be called from other components)
  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = Date.now().toString();
      const newNotification = { ...notification, id };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove after duration (default 5 seconds)
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    []
  );

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Expose the addNotification function globally for easy access
  useEffect(() => {
    (
      window as Window & { addNotification?: typeof addNotification }
    ).addNotification = addNotification;
    return () => {
      delete (window as Window & { addNotification?: typeof addNotification })
        .addNotification;
    };
  }, [addNotification]);

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-daemon-panel/95 border-daemon-success text-daemon-success shadow-lg';
      case 'warning':
        return 'bg-daemon-panel/95 border-daemon-warning text-daemon-warning shadow-lg';
      case 'error':
        return 'bg-daemon-panel/95 border-daemon-danger text-daemon-danger shadow-lg';
      case 'info':
      default:
        return 'bg-daemon-panel/95 border-daemon-info text-daemon-info shadow-lg';
    }
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg border-2 backdrop-blur-sm
            animate-fadeInUp
            ${getNotificationStyles(notification.type)}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-lg font-bold mt-0.5">
                {getIconForType(notification.type)}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-daemon-text-bright uppercase tracking-wide">{notification.title}</h4>
                <p className="text-xs mt-1 text-daemon-text">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-daemon-text hover:text-daemon-text-bright transition-colors font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
