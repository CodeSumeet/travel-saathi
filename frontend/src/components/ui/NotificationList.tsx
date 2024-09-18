import React, { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";

export const NotificationList: React.FC = () => {
  const { notifications, markAsRead, sendTestNotification, wsStatus } =
    useNotifications();

  useEffect(() => {
    console.log(
      "NotificationList re-rendered with notifications:",
      notifications
    );
  }, [notifications]);

  return (
    <div className="bg-white shadow-md rounded-lg max-w-sm w-full">
      <div className="py-2 px-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
      </div>
      <div className="py-2 px-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
        <div>
          <span className="mr-2 text-sm">WebSocket: {wsStatus}</span>
          <button
            onClick={sendTestNotification}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Send Test Notification
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <p className="py-4 px-4 text-gray-500 text-center">
            No notifications
          </p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`py-4 px-4 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer ${
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
  );
};
