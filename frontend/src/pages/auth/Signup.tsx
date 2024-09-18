import { FC, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import logo from "../../assets/icons/Logo.svg";
import useSignup from "../../hooks/useSignup";

const Signup: FC = () => {
  const { signupUser, loading } = useSignup();

  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(username, password, fullName, contactNumber, email);
    signupUser(fullName, username, contactNumber, email, password);
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
            label="Full Name"
            name="fullName"
            id="fullName"
            placeholder="John Doe"
            type="text"
            value={fullName}
            disabled={loading}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Username"
            name="username"
            id="username"
            placeholder="john_doe"
            type="text"
            value={username}
            disabled={loading}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            label="Phone Number"
            name="contactNumber"
            id="contactNumber"
            placeholder="123-456-7890"
            type="text"
            value={contactNumber}
            disabled={loading}
            onChange={(e) => setContactNumber(e.target.value)}
          />

          <Input
            label="Email"
            name="email"
            id="email"
            placeholder="johndoe@example.com"
            type="email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            name="password"
            id="password"
            placeholder="************************"
            type={showPassword ? "text" : "password"}
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="mt-2"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Signup
            </Button>
            <p className="text-center text-xs sm:text-sm md:text-base">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-medium underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Signup;
