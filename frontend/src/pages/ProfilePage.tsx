import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import { Camera, MapPin, Users, Heart, MessageCircle } from "lucide-react";
import Button from "../components/ui/Button";
import PostModal from "../components/ui/PostModal";
import EditProfileModal from "../components/ui/EditProfileModal";

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

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [buddyRequestSent, setBuddyRequestSent] = useState<boolean>(false);
  const { user } = useAuth();
  const [isBuddy, setIsBuddy] = useState<boolean>(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<Profile>(
          userId ? `/users/${userId}/profile` : "/users/me/profile"
        );
        setProfile(response.data);

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

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const closeModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };

  const handleImageClose = () => {
    setEnlargedImage(null);
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
    <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <img
              src={profile.profilePicture || "/api/placeholder/150/150"}
              alt={profile.fullName}
              className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 cursor-pointer"
              onClick={() => setEnlargedImage(profile.profilePicture || "")}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{profile.fullName}</h2>
            <p className="text-gray-500">@{profile.username}</p>
            <p className="mt-2 text-gray-600">{profile.about}</p>
            <p className="flex items-center mt-2 text-gray-500">
              <MapPin
                className="mr-2"
                size={20}
              />
              {profile.city}, {profile.state}, {profile.country}
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6">
            <p className="flex items-center text-gray-500">
              <Users
                className="mr-2"
                size={20}
              />
              {profile.buddiesCount} Buddies
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          {isOwnProfile ? (
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-[#B33A3A] text-white hover:bg-[#9e2a2a] rounded-md transition duration-300"
            >
              Edit Profile
            </Button>
          ) : isBuddy ? (
            <Button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Buddies
            </Button>
          ) : buddyRequestSent ? (
            <Button
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Request Sent
            </Button>
          ) : (
            <Button
              onClick={handleSendBuddyRequest}
              className="px-4 py-2 bg-[#3AB34A] text-white hover:bg-[#33a343] rounded-md transition duration-300"
            >
              Add Buddy
            </Button>
          )}
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleImageClose} // Close modal on overlay click
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to overlay
          >
            <img
              src={enlargedImage}
              alt="Enlarged Profile"
              className="w-96 h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profile.posts.map((post) => (
          <div
            key={post.id}
            className="relative cursor-pointer group"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={post.imageUrl}
              alt={post.description}
              className="w-full h-60 object-cover rounded-lg shadow-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-4 text-lg font-semibold">
                <span className="flex items-center gap-2">
                  <Heart fill="currentColor" />
                  {post.likesCount}
                </span>
                <span className="flex items-center gap-2">
                  <MessageCircle fill="currentColor" />
                  {post.commentsCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPostModalOpen && selectedPost && (
        <PostModal
          postId={selectedPost.id}
          postImage={selectedPost.imageUrl}
          profilePicture={selectedPost.profilePicture}
          fullName={selectedPost.username}
          location={selectedPost.location ?? ""}
          closeModal={() => setSelectedPost(null)}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdate={(updatedProfile) => setProfile(updatedProfile)}
        />
      )}
    </div>
  );
};

export default UserProfile;
