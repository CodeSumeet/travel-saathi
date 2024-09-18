import { FC } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, BookOpen, Users, Map, Compass, LogOut } from "lucide-react"; // Icons for links
import logo from "../../assets/icons/Logo.svg"; // Travel Saathi logo
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";
import apiClient from "../../api/apiClient";
import { NotificationBell } from "./NotificationBell";

const Sidebar: FC = () => {
  const { user, logout } = useAuth(); // Assuming logout is available in the context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiClient.post("/auth/logout");
    logout(); // Clear authentication state
    navigate("/auth/login"); // Redirect to login page
  };

  return (
    <aside
      className={clsx(
        "flex flex-col justify-between bg-white border-t-2 border-gray-200 lg:border-t-0 lg:border-r-2 lg:px-4",
        "lg:w-60 h-16 lg:h-screen fixed bottom-0 lg:top-0 w-full"
      )}
    >
      {/* Logo */}
      <div className="hidden lg:flex justify-center lg:justify-center py-2 lg:py-6 lg:pb-0 lg:pt-6">
        <img
          src={logo}
          alt="Travel Saathi"
          className="w-28 lg:w-40 h-auto lg:mb-8"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex lg:flex-col gap-2 sm:gap-3 md:gap-4 justify-between lg:justify-start font-medium max-lg:p-2">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center lg:justify-start gap-2 py-2 px-3 text-grey hover:bg-gray-100 rounded-lg transition",
              isActive ? "bg-light text-black" : ""
            )
          }
        >
          <Home className="text-2xl lg:text-base" />
          <span className="text-xs lg:text-base hidden lg:inline">Home</span>
        </NavLink>

        <NavLink
          to="/share-experience"
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center lg:justify-start gap-2 py-2 px-3 text-grey hover:bg-gray-100 rounded-lg transition",
              isActive ? "bg-light text-black" : ""
            )
          }
        >
          <BookOpen className="text-2xl lg:text-base" />
          <span className="text-xs lg:text-base hidden lg:inline">
            Share Experience
          </span>
        </NavLink>

        <NavLink
          to="/find-travels"
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center lg:justify-start gap-2 py-2 px-3 text-grey hover:bg-gray-100 rounded-lg transition",
              isActive ? "bg-light text-black" : ""
            )
          }
        >
          <Users className="text-2xl lg:text-base" />
          <span className="text-xs lg:text-base hidden lg:inline">
            Find Travels
          </span>
        </NavLink>

        <NavLink
          to="/group-trips"
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center lg:justify-start gap-2 py-2 px-3 text-grey hover:bg-gray-100 rounded-lg transition",
              isActive ? "bg-light text-black" : ""
            )
          }
        >
          <Map className="text-2xl lg:text-base" />
          <span className="text-xs lg:text-base hidden lg:inline">
            Group Trips
          </span>
        </NavLink>

        <NavLink
          to="/guides"
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center lg:justify-start gap-2 py-2 px-3 text-grey hover:bg-gray-100 rounded-lg transition",
              isActive ? "bg-light text-black" : ""
            )
          }
        >
          <Compass className="text-2xl lg:text-base" />
          <span className="text-xs lg:text-base hidden lg:inline">Guides</span>
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            clsx(
              "flex items-center justify-center lg:justify-start gap-2 py-2 px-3 text-grey hover:bg-gray-100 rounded-lg transition",
              isActive ? "bg-light text-black" : ""
            )
          }
        >
          <NotificationBell />
          <span className="text-xs lg:text-base hidden lg:inline">
            Notifications
          </span>
        </NavLink>
      </nav>

      {/* Profile Button */}
      {user && (
        <div className="flex flex-col items-center lg:items-start gap-2 w-full transition rounded-lg mb-8 lg:mb-4">
          <NavLink
            to={`/profile`}
            className="w-full"
          >
            <div className="hidden lg:flex items-center gap-4 py-2 px-4 w-full hover:bg-light transition rounded-lg">
              <img
                src={user.profilePicture || "path/to/default/avatar"}
                alt={user.fullName}
                className="w-10 h-10 lg:w-8 lg:h-8 rounded-full object-cover"
              />
              <span className="text-sm lg:text-sm font-medium text-gray-800">
                {user.fullName}
              </span>
            </div>
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start gap-2 py-2 px-4 text-gray-800 hover:bg-light rounded-lg transition w-full"
          >
            <LogOut className="text-2xl lg:text-base" />
            <span className="text-xs lg:text-base hidden lg:inline">
              Logout
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
