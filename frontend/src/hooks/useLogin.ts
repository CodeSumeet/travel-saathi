import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const loginUser = async (username: string, password: string) => {
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/login", {
        username,
        password,
      });

      console.log(response);

      const { accessToken, user } = response.data;

      const storeUser = {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.roles,
        profilePicture: user.profilePicture,
        gender: user.gender,
        contactNumber: user.contactNumber,
        city: user.city,
        dob: user.dob,
        bio: user.bio,
      };

      login(storeUser, accessToken);
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading };
};

export default useLogin;
