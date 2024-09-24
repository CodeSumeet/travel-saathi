import React, { useState } from "react";
import Button from "./Button"; // Assume you have a Button component
import Input from "./Input"; // Import the new Input component
import apiClient from "../../api/apiClient";
import { MapPin } from "lucide-react"; // Example icon for the dropdown
import Dropdown from "./DropDown";
import FileUpload from "./FileUpload"; // Import the FileUpload component
import Textarea from "./Textarea"; // Import the Textarea component

interface Post {
  id: string;
  location?: string;
  description: string;
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  userId: string;
  username: string;
  fullName: string;
  profilePicture: string;
  likedByUser: boolean;
  comments?: any[] | null;
}

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
  dob?: string;
  posts: Post[];
  buddiesCount: number;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    about: profile.about || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
    profilePicture: profile.profilePicture || "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("about", formData.about);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("country", formData.country);
      if (selectedFile) {
        formDataToSend.append("profilePicture", selectedFile);
      }

      const response = await apiClient.put(
        `/users/me/profile`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onProfileUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : profile.profilePicture || "" // Use your avatar placeholder
                }
                alt="Profile Avatar"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              />
            </label>
          </div>
          <Input
            name="fullName"
            id="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            type="text"
            onChange={handleChange}
          />
          <Textarea
            name="about"
            id="about"
            label="About"
            placeholder="Tell us about yourself"
            value={formData.about}
            rows={4}
            onChange={handleChange}
          />
          <Dropdown
            label="Location"
            value={`${formData.city}, ${formData.state}, ${formData.country}`}
            icon={<MapPin />} // Icon for the dropdown
            onChange={(location) => {
              setFormData({
                ...formData,
                city: location.city,
                state: location.state,
                country: location.country,
              });
            }}
            placeholder="Search for your location"
          />
          <div className="flex space-x-4">
            <Button
              loading={loading}
              type="submit"
              fullWidth
            >
              Save Changes
            </Button>
            <Button
              type="button"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
