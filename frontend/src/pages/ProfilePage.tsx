import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { Camera, MapPin, Edit2, Grid } from "lucide-react";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

interface Post {
  id: string;
  location?: string;
  description: string;
  imageUrl: string;
  likesCount: number;
  createdAt: string;
  userId: string;
  username: string;
  fullName: string;
  profilePicture: string;
  likedByUser: boolean;
  comments?: any[] | null;
}

interface Profile {
  userId: string; // Updated from id to userId
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
}

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [buddyRequestSent, setBuddyRequestSent] = useState<boolean>(false);
  const { user } = useAuth();
  const [isBuddy, setIsBuddy] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Profile>(
          userId ? `/users/${userId}/profile` : "/users/me/profile"
        );
        setProfile(response.data);
        setEditedProfile(response.data);

        if (user?.id && userId && user.id !== userId) {
          const buddyResponse = await apiClient.get(
            `/buddies/list?userId=${user.id}`
          );
          const buddies = buddyResponse.data;
          const isUserBuddy = buddies.some(
            (buddy: { userId1: string; userId2: string }) =>
              buddy.userId1 === userId || buddy.userId2 === userId
          );
          setIsBuddy(isUserBuddy);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, user?.id]);

  const handleSendBuddyRequest = async () => {
    if (!user?.id || !profile?.userId) return;
    try {
      await apiClient.post(
        `/buddies/request`,
        {
          recipientId: profile.userId,
        },
        { params: { userId: user.id } }
      );
      setBuddyRequestSent(true);
    } catch (error) {
      console.error("Error sending buddy request:", error);
    }
  };

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
      const response = await apiClient.put<{ user: Profile }>(
        `/users/${profile?.userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setProfile(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!profile)
    return (
      <div className="flex justify-center items-center h-screen">
        No profile found
      </div>
    );

  const isOwnProfile = user?.id === profile.userId;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <img
              src={profile.profilePicture || "/api/placeholder/150/150"}
              alt={profile.fullName}
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditing && (
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 bg-[#B33A3A] text-white p-2 rounded-full cursor-pointer"
              >
                <Camera size={20} />
                <input
                  id="profile-picture"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={editedProfile?.fullName || ""}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
                <Input
                  id="username"
                  type="text"
                  name="username"
                  value={editedProfile?.username || ""}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
                <Textarea
                  id="about"
                  label="About"
                  name="about"
                  value={editedProfile?.about || ""}
                  onChange={handleInputChange}
                  placeholder="Bio"
                  rows={3}
                />
                <div className="flex items-center">
                  <MapPin
                    className="mr-2 text-gray-500"
                    size={20}
                  />
                  <Input
                    id="location"
                    type="text"
                    name="location"
                    value={editedProfile?.city || ""}
                    onChange={handleInputChange}
                    placeholder="Location"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
                <p className="text-gray-500">@{profile.username}</p>
                <p className="mt-2">{profile.about}</p>
                <p className="flex items-center mt-2 text-gray-500">
                  <MapPin
                    className="mr-2"
                    size={20}
                  />
                  {profile.city}, {profile.state}, {profile.country}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          {isOwnProfile ? (
            <Button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#B33A3A] text-white hover:bg-[#9e2a2a] rounded-md transition duration-300"
            >
              <div className="flex items-center gap-2">
                <Edit2 size={16} />
                {isEditing ? "Save Profile" : "Edit Profile"}
              </div>
            </Button>
          ) : (
            !isBuddy && (
              <Button
                onClick={handleSendBuddyRequest}
                disabled={buddyRequestSent}
                className="px-4 py-2 bg-[#B33A3A] text-white hover:bg-[#9e2a2a] rounded-md transition duration-300"
              >
                {buddyRequestSent ? "Request Sent" : "Send Buddy Request"}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Grid
            className="mr-2"
            size={24}
          />
          Posts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profile.posts.map((post) => (
            <div
              key={post.id}
              className="relative aspect-square"
            >
              <img
                src={post.imageUrl}
                alt={post.description}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
