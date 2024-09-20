import React from "react";
import { X } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAsRead, sendTestNotification, wsStatus } =
    useNotifications();

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="py-4 px-6 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="py-2 px-6 bg-gray-50 border-b flex justify-between items-center">
          <span className="text-sm text-gray-600">WebSocket: {wsStatus}</span>
          <button
            onClick={sendTestNotification}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Send Test Notification
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-4 px-6 text-gray-500 text-center">
              No notifications
            </p>
          ) : (
            notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`py-4 px-6 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer ${
                  notification.isRead ? "opacity-50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <p className="text-sm text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
