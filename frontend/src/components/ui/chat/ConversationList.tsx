import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { format } from "date-fns"; // Import date-fns for formatting timestamps

interface User {
  id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface Conversation {
  id: string;
  users: User[];
  lastMessage?: {
    id: string;
    senderId: string;
    recipientId: string;
    message: string;
    timestamp: number[]; // [year, month, day, hour, minute, second, nanosecond]
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

  // Helper function to format the timestamp
  const formatTimestamp = (timestamp: number[]): string => {
    const [year, month, day, hour, minute] = timestamp;
    const date = new Date(year, month - 1, day, hour, minute);
    return format(date, "h:mm a"); // Format as "hh:mm a"
  };

  // Sort conversations by the timestamp of the last message
  const sortedConversations = [...conversations].sort((a, b) => {
    const aLastMessageTimestamp = a.lastMessage?.timestamp || [0]; // Default to [0] if no last message
    const bLastMessageTimestamp = b.lastMessage?.timestamp || [0];

    // Convert to date objects for comparison
    const aDate = new Date(
      aLastMessageTimestamp[0],
      aLastMessageTimestamp[1] - 1,
      aLastMessageTimestamp[2],
      aLastMessageTimestamp[3],
      aLastMessageTimestamp[4]
    );
    const bDate = new Date(
      bLastMessageTimestamp[0],
      bLastMessageTimestamp[1] - 1,
      bLastMessageTimestamp[2],
      bLastMessageTimestamp[3],
      bLastMessageTimestamp[4]
    );

    // Sort in descending order (newest first)
    return bDate.getTime() - aDate.getTime();
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="space-y-4">
        {sortedConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="flex items-center p-4 border-b rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex-shrink-0">
              <img
                src={
                  conversation.users.find((u) => u.id !== user?.id)
                    ?.profilePicture || ""
                }
                alt="User Avatar"
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="flex-1 ml-4">
              <div className="font-semibold">
                {conversation.users
                  .filter((u) => u.id !== user?.id)
                  .map((u) => u.fullName)
                  .join(", ")}
              </div>
              {conversation.lastMessage && (
                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                  <div>{conversation.lastMessage.message}</div>
                  <div className="ml-2">
                    {formatTimestamp(conversation.lastMessage.timestamp)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
