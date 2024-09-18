import React, { useState } from "react";
import {
  MoreVertical,
  Heart,
  MessageCircle,
  CircleUserRound,
  Share,
  Send,
} from "lucide-react";
import apiClient from "../../api/apiClient";
import PostModal from "./PostModal"; // Import the modal component
import { useAuth } from "../../context/AuthContext"; // Hook to get auth info

interface PostProps {
  postId: string;
  profilePicture: string;
  fullName: string;
  location: string;
  postImage: string;
  description: string;
  initialLikeCount: number;
  isInitiallyLiked: boolean;
}

const Post: React.FC<PostProps> = ({
  postId,
  profilePicture,
  fullName,
  location,
  postImage,
  description,
  initialLikeCount,
  isInitiallyLiked,
}) => {
  const { user } = useAuth(); // Get user data from auth
  const userId = user?.id;

  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State for Modal

  const handleLikeToggle = async () => {
    if (isLoading || !userId) return;
    setIsLoading(true);

    try {
      const endpoint = isLiked
        ? `/posts/${postId}/unlike`
        : `/posts/${postId}/like`;

      const response = await apiClient.post(endpoint, null, {
        params: { userId },
      });

      setLikeCount(response.data.likeCount);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking the post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg w-full max-w-md mx-auto mb-8">
      {/* Header: Profile Picture, Username, Location, and Options */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={`${fullName} profile`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound
              size={40}
              className="text-gray-400"
            />
          )}
          <div className="ml-3">
            <p className="font-medium text-sm sm:text-base text-grey">
              {fullName}
            </p>
            <p className="text-xs sm:text-sm text-grey">{location}</p>
          </div>
        </div>
        <button className="text-gray-600">
          <MoreVertical size={24} />
        </button>
      </div>

      {/* Post Image */}
      <img
        src={postImage}
        alt="Post content"
        loading="lazy"
        className="w-full h-80 object-cover"
      />

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex space-x-4 mb-2">
          <button
            className="focus:outline-none"
            onClick={handleLikeToggle}
            disabled={isLoading}
          >
            <Heart
              size={24}
              className={isLiked ? "text-red-500 fill-red-500" : "text-grey"}
            />
          </button>
          <button
            className="focus:outline-none"
            onClick={openModal}
          >
            <MessageCircle
              size={24}
              className="text-grey"
            />
          </button>
          <button className="focus:outline-none">
            <Send />
          </button>
        </div>

        {/* Like Count */}
        <p className="text-sm text-grey mb-2">{likeCount} likes</p>

        {/* Description */}
        <p className="text-sm">{description}</p>
      </div>

      {/* PostModal */}
      {isModalOpen && (
        <PostModal
          postId={postId}
          postImage={postImage}
          profilePicture={profilePicture}
          fullName={fullName}
          location={location}
          // description={description}
          closeModal={closeModal} // Close modal function
        />
      )}
    </div>
  );
};

export default Post;
