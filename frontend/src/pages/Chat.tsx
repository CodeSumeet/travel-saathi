import React, { useEffect, useState } from "react";
import { ConversationList } from "../components/ui/ConversationList";
import { MessageWindow } from "../components/ui/MessageWindow";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import apiClient from "../api/apiClient";
import BuddyList from "../components/ui/BuddyList";

interface Conversation {
  id: string;
  userIds: string[];
  lastMessage?: {
    id: string;
    senderId: string;
    recipientId: string;
    message: string;
    timestamp: number[];
  };
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: number[]; // Standardized to string
}

export const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    `ws://localhost:8000/chat`
  );

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;

      try {
        const response = await apiClient.get(`/conversations/user/${user.id}`);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [user?.id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      try {
        const response = await apiClient.get(
          `/chat/conversations/${selectedConversation.id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedConversation, lastMessage]);

  useEffect(() => {
    if (lastMessage && lastMessage.messageType === "CHAT_MESSAGE") {
      const newMessage = lastMessage.payload as Message;

      if (
        newMessage.recipientId === user?.id ||
        newMessage.senderId === user?.id
      ) {
        if (
          selectedConversation &&
          newMessage.recipientId === selectedConversation.id
        ) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }

        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === newMessage.recipientId ||
            conv.id === newMessage.senderId
              ? { ...conv, lastMessage: newMessage }
              : conv
          )
        );
      }
    }
  }, [lastMessage, selectedConversation, user?.id]);

  const handleSendMessage = async (message: string) => {
    if (!selectedConversation || !user?.id) return;

    const recipientId = selectedConversation.userIds.find(
      (id) => id !== user.id
    );
    if (!recipientId) return;

    try {
      const response = await apiClient.post(`/chat/send`, {
        senderId: user.id,
        recipientId,
        message,
      });
      const newMessage = response.data;
      console.log("New Message: ", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // sendMessage({ messageType: "CHAT_MESSAGE", payload: newMessage });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) {
    return <div>Please log in to access the chat.</div>;
  }

  return (
    <div className="w-full flex h-screen">
      <div className="max-w-xl border-r overflow-y-auto">
        <BuddyList />
        <ConversationList
          conversations={conversations}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      {selectedConversation && (
        <MessageWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId={user.id}
        />
      )}
    </div>
  );
};
