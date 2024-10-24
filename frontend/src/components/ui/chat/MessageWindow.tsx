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

// In MessageWindow:
interface MessageWindowProps {
  messages: Message[];
  onSendMessage: (message: { message: string }) => Promise<void>; // Change this line
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
    console.log("MessageWindow received messages:", messages);
  }, [messages]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      try {
        await onSendMessage({ message: newMessage.trim() }); // Change this line
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
