// src/pages/EditProfile.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

interface Profile {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  profilePicture?: string;
  about?: string;
  city?: string;
  state?: string;
  country?: string;
}

const EditProfile: React.FC<{ userId: string; onClose: () => void }> = ({
  userId,
  onClose,
}) => {
  const { user } = useAuth();
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Profile>(
          `/users/${userId}/profile`
        );
        setEditedProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProfile) return;

    const formData = new FormData();
    formData.append("user", JSON.stringify(editedProfile));
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      await apiClient.put(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onClose(); // Close the modal or redirect after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!editedProfile) return <div>No profile found</div>;

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="fullName"
        type="text"
        name="fullName"
        value={editedProfile.fullName}
        onChange={handleInputChange}
        placeholder="Full Name"
      />
      <Input
        id="username"
        type="text"
        name="username"
        value={editedProfile.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <Textarea
        id="about"
        label="About"
        name="about"
        value={editedProfile.about || ""}
        onChange={handleInputChange}
        placeholder="Bio"
        rows={3}
      />
      <Input
        id="location"
        type="text"
        name="location"
        value={editedProfile.city || ""}
        onChange={handleInputChange}
        placeholder="Location"
      />
      <input
        type="file"
        onChange={handleFileChange}
      />
      <Button type="submit">Save Profile</Button>
      <Button
        type="button"
        onClick={onClose}
      >
        Cancel
      </Button>
    </form>
  );
};

export default EditProfile;
