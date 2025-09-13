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
        return 'bg-teal-900/90 border-teal-500 text-teal-300';
      case 'warning':
        return 'bg-yellow-900/90 border-yellow-500 text-yellow-300';
      case 'error':
        return 'bg-red-900/90 border-red-500 text-red-300';
      case 'info':
      default:
        return 'bg-gray-800/90 border-gray-600 text-gray-300';
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
            p-4 rounded-lg border shadow-lg backdrop-blur-sm
            animate-in slide-in-from-right duration-300
            ${getNotificationStyles(notification.type)}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-lg font-bold mt-0.5">
                {getIconForType(notification.type)}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
                <p className="text-xs mt-1 opacity-90">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-current opacity-70 hover:opacity-100 transition-opacity"
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
