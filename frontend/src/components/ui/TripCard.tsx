import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Star, Send, MoreVertical } from "lucide-react";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";

interface TripCardProps {
  trip: {
    id: string;
    userId: string;
    destination: string;
    startTime: number[];
    description: string;
    username: string;
    fullName: string;
    creatorImage: string;
  };
  currentUserId: string | undefined;
}

const TripCard: React.FC<TripCardProps> = ({ trip, currentUserId }) => {
  const { user } = useAuth();
  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestedClick = async () => {
    if (!currentUserId) return;
    setIsLoading(true);

    try {
      await apiClient.post(`/trips/${trip.id}/express-interest`, null, {
        params: { userId: user?.id },
      });
      setIsInterested(true);
    } catch (error) {
      console.error("Error expressing interest:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tripDate = useMemo(
    () =>
      format(
        new Date(trip.startTime[0], trip.startTime[1] - 1, trip.startTime[2]),
        "d MMM, yyyy"
      ),
    [trip.startTime]
  );

  return (
    <div className="bg-light text-grey p-4 rounded-lg shadow-md w-full max-w-4xl lg:max-w-full md:max-w-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={trip.creatorImage || "/placeholder.svg?height=40&width=40"}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-semibold">{trip.fullName}</h2>
            <p className="text-sm">{tripDate} · Find Buddy</p>
          </div>
        </div>
        <button className="text-grey mt-2 md:mt-0">
          <MoreVertical size={20} />
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <div className="flex items-center">
          <MapPin
            size={20}
            className="mr-2 text-grey"
          />
          <p className="text-sm">Travelling to - {trip.destination}</p>
        </div>
        <div className="flex items-center">
          <Calendar
            size={20}
            className="mr-2 text-grey"
          />
          <p className="text-sm">Travelling on - {tripDate}</p>
        </div>
      </div>
      <p className="text-sm mb-4">{trip.description}</p>
      <p className="text-sm mb-4">
        Click 'Interested' if you want to learn more about the trip and join in
        on the fun!
      </p>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={handleInterestedClick}
          disabled={isInterested || isLoading || trip.userId === currentUserId}
          className="flex items-center px-4 py-2 bg-light text-grey border border-grey rounded-full transition-colors disabled:bg-gray-100 disabled:text-gray-400"
        >
          <Star
            size={20}
            className="mr-2"
          />
          {isInterested
            ? "Request Sent"
            : trip.userId === currentUserId
            ? "Your Trip"
            : "Interested"}
        </button>
        <button className="flex items-center px-4 py-2 bg-light text-grey border border-grey rounded-full transition-colors">
          <Send
            size={20}
            className="mr-2"
          />
          Share
        </button>
      </div>
    </div>
  );
};

export default TripCard;
