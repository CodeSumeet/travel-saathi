import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "./pages/auth/Login";
import SignupForm from "./pages/auth/Signup";
import Home from "./pages/Home";
import AuthRoute from "./components/routes/AuthRoute";
import CompleteProfile from "./pages/auth/CompleteProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShareExperience from "./pages/ShareExperience";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import CreateTrip from "./pages/CreateTrip";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import Sidebar from "./components/ui/Sidebar";
import FindTravelsPage from "./pages/FindTravels";
import NotificationsPage from "./pages/NotificationPage";
import { Chat } from "./pages/Chat";

function App() {
  return (
    <div className="w-full h-screen bg-light">
      <Router>
        {/* <Sidebar /> */}
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/auth/login" />}
          />
          <Route
            path="/auth/signup"
            element={
              <AuthRoute>
                <SignupForm />
              </AuthRoute>
            }
          />
          <Route
            path="/auth/login"
            element={
              <AuthRoute>
                <LoginForm />
              </AuthRoute>
            }
          />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/share-experience"
            element={
              <ProtectedRoute>
                <ShareExperience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-travels"
            element={
              <ProtectedRoute>
                <FindTravelsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-trip"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />{" "}
          {/* Logged-in user's profile */}
          <Route
            path="/profile/:userId"
            element={<ProfilePage />}
          />{" "}
          {/* Other user's profile */}
          <Route
            path="/edit-profile"
            element={<EditProfilePage />}
          />{" "}
          {/* Edit profile */}
          <Route
            path="/notifications"
            element={<NotificationsPage />}
          />
          <Route
            path="/chat"
            element={<Chat />}
          />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
