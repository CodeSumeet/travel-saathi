import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Sidebar from "../components/ui/Sidebar";

interface UserProfile {
  name: string;
  username: string;
  profilePicture?: File | null;
}

const EditProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile>({
    name: "",
    username: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          const response = await apiClient.get(`/api/users/me/profile`);
          setProfileData({
            name: response.data.name,
            username: response.data.username,
            profilePicture: null, // For file uploads
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileData({ ...profileData, profilePicture: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user", JSON.stringify(profileData)); // Add user data
      if (profileData.profilePicture) {
        formData.append("profilePicture", profileData.profilePicture); // Add file if exists
      }

      await apiClient.put(`/api/users/${user?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <main className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit}>
            <Input
              id="name"
              label="Name"
              name="name"
              type="text"
              value={profileData.name}
              onChange={handleChange}
            />
            <Input
              id="username"
              label="Username"
              name="username"
              type="text"
              value={profileData.username}
              onChange={handleChange}
            />
            <Input
              id="profilePicture"
              label="Profile Picture"
              name="profilePicture"
              type="file"
              value={""}
              // accept="image/*"
              onChange={handleFileChange}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Update Profile
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditProfilePage;
