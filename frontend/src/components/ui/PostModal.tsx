import React, { useState, useEffect } from "react";
import { Upload, X, Clock, Laugh } from "lucide-react";
import apiClient from "../../api/apiClient";
import Input from "./Input";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext";

interface CommentDTO {
  id: string;
  postId: string;
  comment: string;
  userId: string;
  username: string;
  fullName: string;
  profilePicture: string;
  createdAt: number[]; // Changed to number[]
  updatedAt: number[];
}

interface PostModalProps {
  postId: string;
  postImage: string;
  profilePicture: string;
  fullName: string;
  location: string;
  closeModal: () => void;
}

const PostModal: React.FC<PostModalProps> = ({
  postId,
  postImage,
  profilePicture,
  fullName,
  location,
  closeModal,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/comments/${postId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await apiClient.post(
        `/comments/${postId}/add-comment`,
        null,
        { params: { userId: user?.id, comment: newComment } }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const formatTimeAgo = (dateArray: number[]) => {
    // Ensure the dateArray has the correct length
    if (dateArray.length < 7) {
      console.error("Invalid date array length:", dateArray);
      return "Invalid date";
    }

    // Create a Date object from the array
    const date = new Date(
      dateArray[0], // Year
      dateArray[1] - 1, // Month (0-indexed)
      dateArray[2], // Day
      dateArray[3], // Hour
      dateArray[4], // Minute
      dateArray[5], // Second
      dateArray[6] / 1e6 // Milliseconds (convert nanoseconds to milliseconds)
    );

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateArray);
      return "Invalid date";
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Convert milliseconds to minutes, hours, days
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;

    return "Just now";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl h-[700px] rounded-lg flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-2/3 h-full relative">
          <img
            src={postImage}
            alt="Post content"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/3 lg:w-1/2 flex flex-col py-4 px-2 h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <img
                src={profilePicture}
                alt={`${fullName} profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-sm text-grey">{fullName}</p>
                <p className="text-xs text-grey">{location}</p>
              </div>
            </div>
            <button onClick={closeModal}>
              <X
                size={24}
                className="text-gray-600 mr-2 mv-2"
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-3"
              >
                <div className="flex items-start">
                  <img
                    src={comment.profilePicture}
                    alt={comment.fullName}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{comment.fullName}</p>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center ml-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(comment.createdAt)}{" "}
                    {/* Pass the array directly */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex items-center gap-2">
            <div className="flex-grow">
              <Input
                name="comment"
                id="comment"
                placeholder="Add a comment..."
                value={newComment}
                type="text"
                onChange={(e) => setNewComment(e.target.value)}
                icon={<Laugh />}
              />
            </div>
            <Button
              onClick={handleAddComment}
              size="small"
              loading={false}
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
            >
              <Upload />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
