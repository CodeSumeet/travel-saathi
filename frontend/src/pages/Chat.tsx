import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import apiClient from "../api/apiClient";
import { Menu, X } from "lucide-react";
import Button from "../components/ui/Button";
import { ScrollArea } from "../components/ui/ScrollArea";
import { ConversationList } from "../components/ui/chat/ConversationList";
import { MessageWindow } from "../components/ui/chat/MessageWindow";

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
  timestamp: number[];
}

export const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { lastMessage } = useWebSocket("ws://localhost:8000/chat");
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);

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
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) {
    return <div>Please log in to access the chat.</div>;
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] text-[#333333]">
      <div className="flex-1 flex flex-col lg:flex-row lg:pl-60">
        <div
          className={`${
            isConversationListOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 bg-white border-r border-gray-200 absolute lg:relative z-10 h-full`}
        >
          <div className="p-4 flex justify-between items-center lg:hidden">
            <h2 className="text-xl font-bold">Conversations</h2>
            <Button onClick={() => setIsConversationListOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <ScrollArea className="h-full">
            <ConversationList
              conversations={conversations}
              onSelectConversation={(conversation) => {
                setSelectedConversation(conversation);
                setIsConversationListOpen(false);
              }}
            />
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 shadow flex justify-between items-center">
            <Button
              className="lg:hidden"
              onClick={() => setIsConversationListOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h2 className="text-xl font-bold">
              {selectedConversation
                ? selectedConversation.userIds
                    .filter((id) => id !== user.id)
                    .join(", ")
                : "Select a conversation"}
            </h2>
            <div className="w-6" />
          </div>

          {selectedConversation ? (
            <MessageWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user.id}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
