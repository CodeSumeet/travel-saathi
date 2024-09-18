// src/components/ui/MessageWindow.tsx
import React, { useState } from "react";
import { format } from "date-fns";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: number[];
}

interface MessageWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
}

export const MessageWindow: React.FC<MessageWindowProps> = ({
  messages,
  onSendMessage,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const formatTimestamp = (timestamp: number[]): string => {
    const [year, month, day, hour, minute, second, nanosecond] = timestamp;
    const date = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      nanosecond / 1000000
    );
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="w-full flex flex-col h-full border-l bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            } mb-4`}
          >
            <div className="flex flex-col items-start max-w-xs">
              <div
                className={`p-3 rounded-lg ${
                  message.senderId === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.message}
              </div>
              <div
                className={`text-xs text-gray-500 mt-1 ${
                  message.senderId === currentUserId
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4 flex items-center bg-gray-50">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};
