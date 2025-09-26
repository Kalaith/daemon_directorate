// contexts/NotificationContext.tsx - Proper notification system using React Context
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { generateId } from '../utils/gameHelpers';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

// Auto-removal hook for individual notifications
const useAutoRemove = (
  id: string,
  duration: number,
  removeNotification: (id: string) => void
) => {
  useEffect(() => {
    if (duration <= 0) return; // Don't auto-remove if duration is 0 or negative

    const timer = setTimeout(() => {
      removeNotification(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeNotification]);
};

// Individual notification component with auto-removal
const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const { id, type, title, message, duration = 5000, action } = notification;

  // Use auto-removal hook
  useAutoRemove(id, duration, onRemove);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`${getTypeStyles()} border rounded-lg p-4 mb-3 shadow-sm animate-in slide-in-from-right-full duration-300`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <span className="mr-3 mt-0.5 text-lg" aria-hidden="true">
            {getIcon()}
          </span>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm mt-1 opacity-90">{message}</p>
            {action && (
              <button
                onClick={action.onClick}
                className="mt-2 text-sm underline hover:no-underline font-medium"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => onRemove(id)}
          className="ml-4 text-lg opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>) => {
      const id = generateId(); // Using centralized ID generation
      const newNotification: Notification = {
        ...notification,
        id,
        duration: notification.duration ?? 5000, // Default 5 seconds
      };

      setNotifications(prev => {
        // Limit to maximum 5 notifications to prevent UI overflow
        const updated = [newNotification, ...prev].slice(0, 5);
        return updated;
      });

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* Notification display container */}
      {notifications.length > 0 && (
        <div
          className="fixed top-4 right-4 z-50 w-80 max-w-sm"
          role="region"
          aria-label="Notifications"
        >
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
          {notifications.length > 1 && (
            <button
              onClick={clearAllNotifications}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2"
            >
              Clear all notifications
            </button>
          )}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// Convenience hook for common notification patterns
// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    notifySuccess: (message: string, title = 'Success') =>
      addNotification({ type: 'success', title, message }),

    notifyError: (message: string, title = 'Error') =>
      addNotification({ type: 'error', title, message }),

    notifyWarning: (message: string, title = 'Warning') =>
      addNotification({ type: 'warning', title, message }),

    notifyInfo: (message: string, title = 'Information') =>
      addNotification({ type: 'info', title, message }),

    notifyWithAction: (
      message: string,
      actionLabel: string,
      actionCallback: () => void,
      type: Notification['type'] = 'info',
      title = 'Action Required'
    ) =>
      addNotification({
        type,
        title,
        message,
        action: { label: actionLabel, onClick: actionCallback },
        duration: 0, // Don't auto-remove notifications with actions
      }),
  };
};
