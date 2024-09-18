// src/components/BuddyList.tsx
import React, { useState, useEffect } from "react";
import StartConversation from "./StartConversation";
import { useAuth } from "../../context/AuthContext";
import apiClient from "../../api/apiClient";

interface BuddyUser {
  id: string;
  fullName: string;
  username: string;
  profilePicture: string;
}

interface Buddy {
  id: string;
  name: string;
  user1: BuddyUser;
  user2: BuddyUser;
  accepted: string;
  createdAt: string;
}

const BuddyList: React.FC = () => {
  const { user } = useAuth();
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const fetchBuddies = async () => {
      if (!user?.id) return;

      try {
        const response = await apiClient.get("/buddies/list", {
          params: { userId: user.id },
        });
        setBuddies(response.data);
      } catch (error) {
        console.error("Error fetching buddies:", error);
      }
    };

    fetchBuddies();
  }, [user?.id]);

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      const response = await apiClient.get(`/conversations/user/${user.id}`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleConversationStarted = () => {
    fetchConversations();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Buddies</h2>
      <div className="space-y-4">
        {buddies.map((buddy) => (
          <div
            key={buddy.id}
            className="flex items-center p-4 border-b rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src={
                buddy.user1.id === user?.id
                  ? buddy.user2.profilePicture
                  : buddy.user1.profilePicture
              }
              alt={
                buddy.user1.id === user?.id
                  ? buddy.user2.fullName
                  : buddy.user1.fullName
              }
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
              <div className="font-semibold">
                {buddy.user1.id === user?.id
                  ? buddy.user2.fullName
                  : buddy.user1.fullName}
              </div>
              <div className="text-sm text-gray-500">
                {buddy.accepted === "true" ? "Online" : "Offline"}
              </div>
            </div>
            <StartConversation
              buddyId={
                buddy.user1.id === user?.id ? buddy.user2.id : buddy.user1.id
              }
              onStart={handleConversationStarted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuddyList;
