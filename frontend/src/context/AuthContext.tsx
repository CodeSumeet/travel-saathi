import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

type AuthState = {
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
    role: string;
    profilePicture: string;
    gender: string;
    contactNumber: string;
    city: string;
    dob: string;
    about: string;
  } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (
    user: {
      id: string;
      fullName: string;
      username: string;
      email: string;
      role: string;
      profilePicture: string;
      gender: string;
      contactNumber: string;
      city: string;
      dob: string;
      about: string;
    },
    token: string
  ) => void;
  logout: () => void;
  loading: boolean; // New loading state
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthState["user"]>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // New loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }

    setLoading(false); // Set loading to false once local storage is checked
  }, []);

  const login = (
    user: {
      id: string;
      fullName: string;
      username: string;
      email: string;
      role: string;
      profilePicture: string;
      gender: string;
      contactNumber: string;
      city: string;
      dob: string;
      about: string;
    },
    token: string
  ) => {
    setUser(user);
    setAccessToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const contextValue = {
    user,
    accessToken,
    isAuthenticated: !!user,
    login,
    logout,
    loading, // Provide loading state to context
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
