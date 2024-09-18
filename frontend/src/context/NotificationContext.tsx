// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import { useAuth } from "./AuthContext";
// import apiClient from "../api/apiClient";
// import { Client, StompSubscription } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// // Types
// interface Notification {
//   id: string;
//   type: "LIKE" | "TRIP_INTEREST" | "COMMENT";
//   message: string;
//   createdAt: string;
//   isRead: boolean;
// }

// interface NotificationContextType {
//   notifications: Notification[];
//   markAsRead: (id: string) => void;
//   sendTestNotification: () => void;
//   wsStatus: string;
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined
// );

// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user, loading, accessToken } = useAuth();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [stompClient, setStompClient] = useState<Client | null>(null);
//   const [wsStatus, setWsStatus] = useState<string>("");

//   const addNotification = useCallback((notification: Notification) => {
//     console.log("Adding new notification:", notification);
//     setNotifications((prev) => {
//       const updatedNotifications = [notification, ...prev];
//       console.log("Updated notifications state:", updatedNotifications);
//       return updatedNotifications;
//     });
//   }, []);

//   const markAsRead = async (id: string) => {
//     try {
//       await apiClient.post(`/notifications/${id}/read`);
//       setNotifications((prev) =>
//         prev.map((notif) =>
//           notif.id === id ? { ...notif, isRead: true } : notif
//         )
//       );
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!loading && user?.id && accessToken) {
//         try {
//           const response = await apiClient.get(
//             `/notifications/user/${user.id}`
//           );
//           console.log("Fetched initial notifications:", response.data);
//           setNotifications(response.data);
//         } catch (error) {
//           console.error("Failed to fetch notifications:", error);
//         }
//       }
//     };

//     fetchNotifications();
//   }, [loading, user?.id, accessToken]);

//   useEffect(() => {
//     if (user?.id) {
//       const socket = new SockJS("http://localhost:8000/notifications");
//       const client = new Client({
//         webSocketFactory: () => socket,
//         connectHeaders: {},
//         debug: (str) => console.log(str),
//         reconnectDelay: 5000,
//         heartbeatIncoming: 4000,
//         heartbeatOutgoing: 4000,
//         onConnect: (frame) => {
//           console.log("Connected to WebSocket server:", frame);
//           setWsStatus("Connected");

//           const subscription: StompSubscription = client.subscribe(
//             `/topic/notifications/${user.id}`,
//             (message) => {
//               console.log("Received message:", message.body);
//               try {
//                 const notification: Notification = JSON.parse(message.body);
//                 console.log("Parsed notification:", notification);
//                 if (
//                   notification.id &&
//                   notification.type &&
//                   notification.message
//                 ) {
//                   console.log("Valid notification received, adding to state");
//                   addNotification(notification);
//                 } else {
//                   console.log(
//                     "Received incomplete notification:",
//                     notification
//                   );
//                 }
//               } catch (error) {
//                 console.error("Error parsing notification:", error);
//                 console.error("Raw message data:", message.body);
//               }
//             }
//           );

//           client.onDisconnect = () => {
//             console.log("WebSocket connection closed");
//             setWsStatus("Disconnected");
//           };
//         },
//         onStompError: (frame) => {
//           console.error("STOMP error:", frame);
//           setWsStatus("Error");
//         },
//       });

//       client.activate();
//       setStompClient(client);

//       return () => {
//         console.log("Cleaning up WebSocket connection");
//         if (client && client.connected) {
//           client.deactivate();
//         }
//       };
//     }
//   }, [user?.id, addNotification]);

//   console.log("Current notifications state:", notifications);

//   const sendTestNotification = useCallback(() => {
//     if (stompClient && stompClient.connected) {
//       const testNotification = {
//         type: "TEST",
//         message: "This is a test notification",
//         test: "",
//       };
//       stompClient.publish({
//         destination: "/topic/test",
//         body: JSON.stringify(testNotification),
//       });
//       console.log("Test notification sent:", testNotification);
//     } else {
//       console.error("STOMP client is not connected.");
//     }
//   }, [stompClient]);

//   return (
//     <NotificationContext.Provider
//       value={{ notifications, markAsRead, sendTestNotification, wsStatus }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error(
//       "useNotifications must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import apiClient from "../api/apiClient";

// Types
interface Notification {
  id: string;
  type: "LIKE" | "TRIP_INTEREST" | "COMMENT";
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  sendTestNotification: () => void;
  wsStatus: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading, accessToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = useRef<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<string>("");

  const addNotification = useCallback((notification: Notification) => {
    console.log("Adding new notification:", notification);
    setNotifications((prev) => {
      const updatedNotifications = [notification, ...prev];
      console.log("Updated notifications state:", updatedNotifications);
      return updatedNotifications;
    });
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiClient.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!loading && user?.id && accessToken) {
        try {
          const response = await apiClient.get(
            `/notifications/user/${user.id}`
          );
          console.log("Fetched initial notifications:", response.data);
          setNotifications(response.data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [loading, user?.id, accessToken]);

  useEffect(() => {
    if (user?.id) {
      const wsUrl = `ws://localhost:8000/notifications?userId=${user.id}`;
      console.log("Attempting to connect to WebSocket:", wsUrl);
      const ws = new WebSocket(wsUrl);
      socket.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established");
        setWsStatus("Connected");
      };

      ws.onmessage = (event) => {
        console.log("Received WebSocket message. Event:", event);
        console.log("Message data:", event.data);
        try {
          const notification: Notification = JSON.parse(event.data);
          console.log("Parsed notification:", notification);
          if (notification.id && notification.type && notification.message) {
            console.log("Valid notification received, adding to state");
            addNotification(notification);
          } else {
            console.log("Received incomplete notification:", notification);
          }
        } catch (error) {
          console.error("Error parsing notification:", error);
          console.error("Raw message data:", event.data);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsStatus("Error");
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed. Event:", event);
        console.log("Close code:", event.code);
        console.log("Close reason:", event.reason);
        setWsStatus("Disconnected");

        // Attempt to reconnect after a delay
        setTimeout(() => {
          setWsStatus("Reconnecting...");
        }, 5000);
      };

      // Ping the server every 30 seconds to keep the connection alive
      const intervalId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ messageType: "PING" }));
          console.log("Ping sent to server");
        }
      }, 30000);

      return () => {
        console.log("Cleaning up WebSocket connection");
        clearInterval(intervalId);
        ws.close();
        socket.current = null;
      };
    }
  }, [user?.id, addNotification]);

  console.log("Current notifications state:", notifications);

  const sendTestNotification = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      const testNotification = {
        type: "TEST",
        message: "This is a test notification",
        test: "",
      };
      socket.current.send(JSON.stringify(testNotification));
      console.log("Test notification sent:", testNotification);
    } else {
      console.error(
        "WebSocket is not open. Current state:",
        socket.current?.readyState
      );
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, sendTestNotification, wsStatus }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
