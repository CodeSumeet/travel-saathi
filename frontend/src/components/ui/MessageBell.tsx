import { MessageSquare } from "lucide-react";
import React from "react";

export const MessageBell: React.FC = () => {
  return (
    <div className="relative">
      <button className="focus:outline-none">
        <MessageSquare />
      </button>
    </div>
  );
};
