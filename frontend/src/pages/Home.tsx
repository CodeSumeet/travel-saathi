import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import Post from "../components/ui/Post";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  async function fetchPosts() {
    try {
      if (user && user.id) {
        const response = await apiClient.get("/posts/all-posts", {
          params: { userId: user.id }, // Pass userId as a query parameter
        });
        setPosts(response.data);
      }
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPosts();
    }
  }, [user, isAuthenticated]);

  return (
    <div className="flex">
      <main className="w-full h-screen overflow-y-scroll">
        <div className="w-full">
          {posts.map((post) => (
            <Post
              key={post.id}
              profilePicture={post.profilePicture} // Assuming this field exists
              fullName={post.fullName}
              location={post.location}
              postImage={post.imageUrl} // Assuming this field exists
              description={post.description}
              initialLikeCount={post.likesCount}
              isInitiallyLiked={post.likedByUser}
              // userId={user!.id} // Pass the current userId to the Post component
              postId={post.id}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
