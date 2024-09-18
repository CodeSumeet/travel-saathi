import React from "react";
import { NotificationList } from "../components/ui/NotificationList";

const NotificationsPage: React.FC = () => {
  return (
    <div className="ml-64 container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;
