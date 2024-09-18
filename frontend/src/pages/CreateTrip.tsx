import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Sidebar from "../components/ui/Sidebar";

const CreateTrip: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tripData, setTripData] = useState({
    destination: "",
    description: "",
    startTime: "",
    endTime: "",
    maxTravelers: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTripData((prevData) => ({
      ...prevData,
      [name]: name === "maxTravelers" ? parseInt(value) || 0 : value,
    }));
  };

  const formatDateTimeForInput = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    // Validate date and time
    if (!tripData.startTime || !tripData.endTime) {
      toast.error("Please enter valid start and end times.");
      return;
    }

    try {
      setIsLoading(true);

      const formattedTripData = {
        ...tripData,
        startTime: new Date(tripData.startTime).toISOString(),
        endTime: new Date(tripData.endTime).toISOString(),
      };

      const response = await apiClient.post(
        `/trips/create-trip`,
        formattedTripData,
        {
          params: { userId: user.id },
        }
      );

      console.log("Create trip response:", response);

      toast.success("Trip created successfully!");
      navigate("/trips");
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create the trip.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <main className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create Your Trip
            </h1>
            <p className="text-gray-600">
              Plan your next adventure with TravelSaathi!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              id="destination"
              label="Destination"
              name="destination"
              type="text"
              value={tripData.destination}
              onChange={handleChange}
              placeholder="Enter trip destination"
            />

            <Textarea
              id="description"
              label="Description"
              name="description"
              value={tripData.description}
              onChange={handleChange}
              placeholder="Describe the trip"
              rows={4}
            />

            <Input
              id="startTime"
              label="Start Time"
              name="startTime"
              value={formatDateTimeForInput(tripData.startTime)}
              onChange={handleChange}
              type="datetime-local"
            />

            <Input
              id="endTime"
              label="End Time"
              name="endTime"
              value={formatDateTimeForInput(tripData.endTime)}
              onChange={handleChange}
              type="datetime-local"
            />

            <Input
              id="maxTravelers"
              label="Maximum Travelers"
              name="maxTravelers"
              value={tripData.maxTravelers.toString()}
              onChange={handleChange}
              type="number"
              // min="1"
            />

            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
              >
                Create Trip
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateTrip;
