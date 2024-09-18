import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const useSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const signupUser = async (
    fullName: string,
    username: string,
    contactNumber: string,
    email: string,
    password: string
  ) => {
    setLoading(true);

    try {
      await apiClient.post("/auth/register", {
        fullName,
        username,
        contactNumber,
        email,
        password,
      });

      navigate("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return { signupUser, loading };
};

export default useSignup;
