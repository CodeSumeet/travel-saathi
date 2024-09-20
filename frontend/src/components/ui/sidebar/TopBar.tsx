import { FC, useState } from "react";
import { NavLink } from "react-router-dom";
import { MessageSquare } from "lucide-react"; // Icons for links
import logo from "../../../assets/icons/Logo.svg";
import { NotificationBell } from "../NotificationBell";
import { NotificationDrawer } from "../notification/NotificationDrawer";

const TopBar: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = (): void => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="lg:hidden flex justify-between items-center px-4 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10 h-16">
      <img
        src={logo}
        alt="Travel Saathi"
        className="w-28"
      />
      <div className="flex gap-6">
        <NavLink
          to="/chat"
          className="text-gray-700 hover:text-black"
        >
          <MessageSquare className="text-2xl" />
        </NavLink>
        <button
          className="text-gray-700 hover:text-black"
          onClick={toggleDrawer}
        >
          <NotificationBell />
        </button>

        <NotificationDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </div>
  );
};

export default TopBar;
