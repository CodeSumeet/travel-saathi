// src/components/StartConversation.tsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";

interface StartConversationProps {
  buddyId: string;
  onStart: () => void;
}

const StartConversation: React.FC<StartConversationProps> = ({
  buddyId,
  onStart,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartConversation = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    try {
      await apiClient.post("/conversations/start", null, {
        params: {
          userId1: user.id,
          userId2: buddyId,
        },
      });
      onStart();
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartConversation}
      className={`bg-blue-500 text-white px-4 py-2 rounded ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isLoading}
    >
      {isLoading ? "Starting..." : "Start Conversation"}
    </button>
  );
};

export default StartConversation;
