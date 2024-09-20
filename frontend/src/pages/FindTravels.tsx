import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import Sidebar from "../components/ui/sidebar/Sidebar";
import TripCard from "../components/ui/TripCard";

interface Trip {
  id: string;
  userId: string;
  destination: string;
  startTime: string;
  endTime: string;
  description: string;
  username: string;
  fullName: string;
  creatorImage: string;
  userRequestStatus?: "interested" | "requestSent"; // Optional field for tracking request status
}

const FindTravelsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await apiClient.get("/trips/all-trips");
        setTrips(response.data);
      } catch (err) {
        setError("Failed to load trips. Please try again later.");
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Find Travel Buddies
          </h1>
          {loading ? (
            <p className="text-center">Loading trips...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : trips.length === 0 ? (
            <p className="text-center">No trips found.</p>
          ) : (
            <div className="flex flex-col items-center gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="w-full max-w-md"
                >
                  <TripCard
                    trip={trip}
                    currentUserId={user?.id}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindTravelsPage;
