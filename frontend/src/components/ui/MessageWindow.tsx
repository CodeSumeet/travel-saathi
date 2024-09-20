import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { ScrollArea } from "./ScrollArea";
import Textarea from "./Textarea";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
    return format(date, "h:mm a");
  };

  return (
    <div className="flex-1 flex flex-col">
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
          {/* <Input
            id="message"
            name="message"
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          /> */}
          <div className="flex-grow">
            <Textarea
              id="message"
              name="message"
              label=""
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
            />
          </div>
          <Button
            size="medium"
            className="my-auto bg-deepRed hover:bg-deepRed-dark text-white"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
