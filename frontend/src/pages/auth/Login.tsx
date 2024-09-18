// src/pages/auth/Login.tsx
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import logo from "../../assets/icons/Logo.svg";
import useLogin from "../../hooks/useLogin";

const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { loginUser, loading } = useLogin();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(username, password);
  };

  return (
    <div className="w-full min-h-screen grid place-items-center bg-light px-4 sm:px-6">
      <main className="w-full max-w-sm p-4 sm:p-6 bg-white rounded-md sm:rounded-lg md:rounded-xl shadow-md mx-4 sm:mx-6 md:mx-8 lg:mx-12">
        <figure className="w-32 sm:w-40 md:w-52 mb-6 mx-auto">
          <img
            src={logo}
            alt="Travel Saathi"
            className="w-full h-auto"
          />
        </figure>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Input
            label="Username"
            name="username"
            id="username"
            placeholder="john_doe"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="flex flex-col gap-2">
            <Input
              label="Password"
              name="password"
              id="password"
              placeholder="************************"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />
            <Link
              to="/"
              className="text-left underline text-xs sm:text-sm md:text-base"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="mt-2"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Login
            </Button>
            <p className="text-center text-xs sm:text-sm md:text-base">
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="font-medium underline"
              >
                Signup
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
