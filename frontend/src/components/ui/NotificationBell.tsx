import { Bell } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export const NotificationBell: React.FC = () => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
