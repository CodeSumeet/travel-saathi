import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { ScrollArea } from "../ScrollArea";
import Input from "../Input"; // Import the updated Input component with emoji support
import Button from "../Button";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: number[];
}

interface MessageWindowProps {
  messages: Message[];
  onSendMessage: (message: Message) => Promise<void>;
  currentUserId: string;
}

export const MessageWindow: React.FC<MessageWindowProps> = ({
  messages,
  onSendMessage,
  currentUserId,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on mount and when messages change
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const messagePayload: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        recipientId: "", // Set this appropriately in your main chat logic
        message: newMessage,
        timestamp: [
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate(),
          new Date().getHours(),
          new Date().getMinutes(),
          new Date().getSeconds(),
          0,
        ],
      };

      onSendMessage(messagePayload); // Send the message payload
      setNewMessage(""); // Clear input after sending
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents adding a new line when pressing Enter
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: number[]): string => {
    const [year, month, day, hour, minute, second] = timestamp;
    const date = new Date(year, month - 1, day, hour, minute, second);
    return format(date, "h:mm a");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea
        className="flex-1 p-4"
        ref={scrollAreaRef}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.senderId === currentUserId
                  ? "bg-[#B33A3A] text-white"
                  : "bg-white"
              }`}
            >
              <p className="max-w-sm sm:max-w-md text-left">
                {message.message}
              </p>
              <p className="text-xs mt-1 opacity-70">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex gap-4">
          <div className="flex-grow">
            <Input
              id="message"
              name="message"
              label=""
              placeholder="Type your message..."
              value={newMessage}
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              enableEmoji={true} // Enable emoji picker
            />
          </div>
          <Button
            size="medium"
            className="my-auto bg-deepRed hover:bg-deepRed-dark text-white"
            onClick={handleSend}
          >
            <Send className="h-6 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
