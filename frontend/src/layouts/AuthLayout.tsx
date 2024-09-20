import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-screen bg-light">
      {/* The Outlet component will render the matching child route */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
