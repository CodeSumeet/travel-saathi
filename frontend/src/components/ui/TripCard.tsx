import React, { useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Star, Send, MoreVertical } from "lucide-react";
import apiClient from "../../api/apiClient";

interface TripCardProps {
  trip: {
    id: string;
    userId: string;
    destination: string;
    startTime: string;
    description: string;
    username: string;
    fullName: string;
    creatorImage: string;
  };
  currentUserId: string | undefined;
}

const TripCard: React.FC<TripCardProps> = ({ trip, currentUserId }) => {
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestedClick = async () => {
    if (!currentUserId) return;
    setIsLoading(true);

    try {
      await apiClient.post("/connections/interested", null, {
        params: {
          fromUserId: currentUserId,
          toUserId: trip.userId,
          postId: trip.id,
        },
      });
      setIsInterested(true);
    } catch (error) {
      console.error("Error expressing interest:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={trip.creatorImage || "/default-avatar.png"}
              alt={trip.fullName}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base">
                {trip.fullName}
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                {format(new Date(trip.startTime), "do, MMM yyyy")} • Find Buddy
              </p>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 rounded-full p-1">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin
              size={16}
              className="mr-2 flex-shrink-0"
            />
            <p className="text-sm md:text-base">
              Travelling to- {trip.destination}
            </p>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar
              size={16}
              className="mr-2 flex-shrink-0"
            />
            <p className="text-sm md:text-base">
              Travelling on- {format(new Date(trip.startTime), "d MMM, yyyy")}
            </p>
          </div>
        </div>
        <p className="text-sm md:text-base text-gray-600 mb-4">
          {trip.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleInterestedClick}
            disabled={
              isInterested || isLoading || trip.userId === currentUserId
            }
            className={`flex items-center px-3 py-1 rounded-full transition-colors ${
              isInterested
                ? "bg-yellow-100 text-yellow-600"
                : trip.userId === currentUserId
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Star
              size={16}
              className="mr-1"
            />
            <span className="text-xs md:text-sm">
              {isInterested
                ? "Request Sent"
                : trip.userId === currentUserId
                ? "Your Trip"
                : "Interested"}
            </span>
          </button>
          <button className="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-full transition-colors">
            <Send
              size={16}
              className="mr-1"
            />
            <span className="text-xs md:text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
