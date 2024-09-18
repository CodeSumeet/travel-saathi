import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
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
  location?: string;
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

        // Check buddy status
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500">
              <img
                src={profile.profilePicture || "/api/placeholder/150/150"}
                alt={profile.fullName}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </div>
            <div className="pt-20 md:pt-24 p-6">
              {isEditing ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Input fields for profile editing */}
                </form>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.fullName}
                  </h1>
                  <p className="text-gray-600 mb-4">@{profile.username}</p>
                  <p className="mb-6 text-gray-700">{profile.about}</p>

                  {/* Buddy Request Button */}
                  {!isOwnProfile && !isBuddy && (
                    <Button
                      onClick={handleSendBuddyRequest}
                      disabled={buddyRequestSent}
                    >
                      {buddyRequestSent ? "Request Sent" : "Send Buddy Request"}
                    </Button>
                  )}

                  {/* Display Posts */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Posts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.posts.map((post) => (
                        <div
                          key={post.id}
                          className="bg-white rounded-lg shadow-lg overflow-hidden"
                        >
                          <img
                            src={post.imageUrl}
                            alt={post.description}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h3 className="font-bold">{post.location}</h3>
                            <p>{post.description}</p>
                            <p className="text-sm text-gray-500">
                              Likes: {post.likesCount}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Post Modal */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
