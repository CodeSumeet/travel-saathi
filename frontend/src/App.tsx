import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthRoute from "./components/routes/AuthRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import MainLayout from "./layouts/MainLayout"; // New MainLayout
import AuthLayout from "./layouts/AuthLayout"; // New AuthLayout

import LoginForm from "./pages/auth/Login";
import SignupForm from "./pages/auth/Signup";
import Home from "./pages/Home";
import CompleteProfile from "./pages/auth/CompleteProfile";
import ShareExperience from "./pages/ShareExperience";
import CreateTrip from "./pages/CreateTrip";
import ProfilePage from "./pages/ProfilePage";
import FindTravelsPage from "./pages/FindTravels";
import NotificationsPage from "./pages/NotificationPage";
import { Chat } from "./pages/Chat";

function App() {
  return (
    <div className="w-full h-screen bg-light">
      <Router>
        <Routes>
          {/* Routes with AuthLayout */}
          <Route element={<AuthLayout />}>
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
          </Route>

          {/* Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={<Navigate to="/auth/login" />}
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
                // <ProtectedRoute>
                <Home />
                // </ProtectedRoute>
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
            />
            <Route
              path="/profile/:userId"
              element={<ProfilePage />}
            />
            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />
            <Route
              path="/chat"
              element={<Chat />}
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
