import React from "react";
import { X } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string; // Keep createdAt as string for initial data
  actorId: string;
  username: string;
  profilePicture: string; // Profile picture URL
}

// Custom function to format time ago like Instagram
const formatTimeAgo = (dateString: string): string => {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s`; // seconds
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`; // minutes
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`; // hours
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`; // days
  return `${Math.floor(seconds / 604800)}w`; // weeks
};

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAsRead, sendTestNotification, wsStatus } =
    useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark the notification as read
    await markAsRead(notification.id);
  };

  const handleProfilePictureClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation(); // Prevent triggering the parent notification click
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="py-4 px-6 bg-gray-100 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="py-2 px-6 bg-gray-100 border-b flex justify-between items-center">
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
                className={`flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer ${
                  notification.isRead ? "opacity-50" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-center">
                  {/* Profile Picture */}
                  <img
                    src={notification.profilePicture}
                    alt={`${notification.username}'s profile`}
                    className="w-10 h-10 rounded-full cursor-pointer mr-3"
                    onClick={(e) =>
                      handleProfilePictureClick(e, notification.actorId)
                    }
                  />
                  <div>
                    <p className="text-sm text-gray-800">
                      {notification.message.split(" ").map((word, index) => {
                        const isUsername = word.includes(notification.username);
                        return isUsername ? (
                          <span
                            key={index}
                            className="text-blue-600 cursor-pointer hover:underline"
                          >
                            {word}
                          </span>
                        ) : (
                          <span key={index}>{word} </span>
                        );
                      })}
                    </p>
                  </div>
                  .
                  <span className="text-sm text-gray-500">
                    &nbsp;
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
