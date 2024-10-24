// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
// } from "react";
// import { useAuth } from "./AuthContext";
// import apiClient from "../api/apiClient";

// // Types
// interface Message {
//   id: string;
//   senderId: string;
//   recipientId: string;
//   content: string;
//   createdAt: string;
//   read: boolean;
// }

// interface Conversation {
//   id: string;
//   lastMessage: Message;
// }

// interface MessageContextProps {
//   messages: Message[];
//   conversations: Conversation[];
//   fetchConversationMessages: (conversationId: string) => void;
//   markAsRead: (messageId: string) => void;
//   wsStatus: string;
//   unreadCount: number;
// }

// const MessageContext = createContext<MessageContextProps | undefined>(
//   undefined
// );

// export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [unreadCount, setUnreadCount] = useState<number>(0);
//   const socket = useRef<WebSocket | null>(null);
//   const [wsStatus, setWsStatus] = useState<string>("");

//   const addMessage = useCallback((message: Message) => {
//     setMessages((prev) => [message, ...prev]);
//     if (!message.read) {
//       setUnreadCount((prevCount) => prevCount + 1);
//     }
//   }, []);

//   const markAsRead = async (messageId: string) => {
//     try {
//       await apiClient.post(`/chat/messages/${messageId}/read`);

//       setMessages((prevMessages) =>
//         prevMessages.map((msg) =>
//           msg.id === messageId ? { ...msg, read: true } : msg
//         )
//       );

//       // Recalculate unread count based on the current messages
//       setUnreadCount((prevCount) => {
//         const unreadMessages = messages.filter((msg) => !msg.read);
//         return unreadMessages.length > 0 ? unreadMessages.length : 0;
//       });
//     } catch (error) {
//       console.error("Failed to mark message as read:", error);
//     }
//   };

//   const fetchConversationMessages = async (conversationId: string) => {
//     try {
//       const response = await apiClient.get(
//         `/chat/conversations/${conversationId}`
//       );
//       const conversationMessages = response.data;

//       // Automatically mark unread messages as read when conversation is opened
//       const unreadMessages = conversationMessages.filter(
//         (msg: Message) => !msg.read
//       );
//       unreadMessages.forEach((msg: Message) => markAsRead(msg.id));

//       setMessages(conversationMessages);
//     } catch (error) {
//       console.error("Failed to fetch conversation messages:", error);
//     }
//   };

//   // Only create a WebSocket connection if it doesn't already exist
//   useEffect(() => {
//     if (user?.id && !socket.current) {
//       const wsUrl = `ws://localhost:8000/chat?userId=${user.id}`;
//       const ws = new WebSocket(wsUrl);
//       socket.current = ws;

//       ws.onopen = () => {
//         setWsStatus("Connected");
//       };

//       ws.onmessage = (event) => {
//         try {
//           const incomingMessage = JSON.parse(event.data);
//           const message: Message = {
//             id: incomingMessage.id,
//             senderId: incomingMessage.senderId,
//             recipientId: incomingMessage.recipientId,
//             content: incomingMessage.message,
//             createdAt: new Date().toISOString(),
//             read: incomingMessage.read,
//           };

//           addMessage(message);
//         } catch (error) {
//           console.error("Error parsing message:", error);
//         }
//       };

//       ws.onerror = (error) => {
//         console.error("WebSocket error:", error);
//         setWsStatus("Error");
//       };

//       ws.onclose = () => {
//         setWsStatus("Disconnected");
//         setTimeout(() => {
//           setWsStatus("Reconnecting...");
//         }, 5000);
//       };

//       return () => {
//         ws.close();
//         socket.current = null; // Clean up socket
//       };
//     }
//   }, [user?.id, addMessage]);

//   return (
//     <MessageContext.Provider
//       value={{
//         messages,
//         conversations,
//         fetchConversationMessages,
//         markAsRead,
//         wsStatus,
//         unreadCount,
//       }}
//     >
//       {children}
//     </MessageContext.Provider>
//   );
// };

// export const useMessages = () => {
//   const context = useContext(MessageContext);
//   if (!context) {
//     throw new Error("useMessages must be used within a MessageProvider");
//   }
//   return context;
// };
