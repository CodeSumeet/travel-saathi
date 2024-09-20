import Sidebar from "../components/ui/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full h-screen bg-light">
        {/* The Outlet component will render the matching child route */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
