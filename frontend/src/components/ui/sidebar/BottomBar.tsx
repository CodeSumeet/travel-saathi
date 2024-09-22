import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Plus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const BottomBar: FC = () => {
  const { user } = useAuth();

  return (
    <div className="lg:hidden flex justify-around items-center py-4 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10 h-16">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "text-black" : "text-gray-700"
          } hover:text-black`
        }
      >
        <Home className="text-2xl" />
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink
        to="/share-experience"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "text-black" : "text-gray-700"
          } hover:text-black`
        }
      >
        <Plus className="text-2xl" />
        <span className="text-xs">Add Post</span>
      </NavLink>
      <NavLink
        to="/find-travels"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "text-black" : "text-gray-700"
          } hover:text-black`
        }
      >
        <Users className="text-2xl" />
        <span className="text-xs">Travels</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 ${
            isActive ? "text-black" : "text-gray-700"
          } hover:text-black`
        }
      >
        <img
          src={user?.profilePicture || "path/to/default/avatar"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
};

export default BottomBar;
