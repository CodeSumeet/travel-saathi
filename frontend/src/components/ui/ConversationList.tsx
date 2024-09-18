// src/components/ui/ConversationList.tsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

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

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
}) => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center p-4 border-b rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex-1">
              <div className="font-semibold">
                {conversation.userIds
                  .filter((id) => id !== user?.id)
                  .join(", ")}
              </div>
              {conversation.lastMessage && (
                <div className="text-sm text-gray-500 mt-1">
                  {conversation.lastMessage.message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
