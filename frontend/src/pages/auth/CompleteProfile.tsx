import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import avatarPlaceholder from "../../assets/icons/avatar-placeholder.svg";
import logo from "../../assets/icons/Logo.svg";
import GenderRadioGroup from "../../components/ui/RadioButton";
import Dropdown from "../../components/ui/DropDown";
import Textarea from "../../components/ui/Textarea";
import { MapPin } from "lucide-react";
import apiClient from "../../api/apiClient";

interface Location {
  city: string;
  state: string;
  country: string;
}

const CompleteProfile: FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [username, setUsername] = useState<string>(user?.username || "");
  const [contactNumber, setContactNumber] = useState<string>(
    user?.contactNumber || ""
  );
  const [email, setEmail] = useState<string>(user?.email || "");
  const [location, setLocation] = useState<Location>({
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
  });
  const [gender, setGender] = useState<string>(user?.gender || "");
  const [about, setAbout] = useState<string>(user?.about || "");

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleLocationChange = (newLocation: Location) => {
    console.log("New location:", newLocation);
    setLocation(newLocation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userDTO = {
        fullName,
        username,
        contactNumber,
        email,
        city: location.city,
        state: location.state,
        country: location.country,
        gender,
        about,
      };

      const formData = new FormData();
      formData.append("user", JSON.stringify(userDTO));
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await apiClient.put(`/users/${user?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { user: updatedUser } = response.data;
      login(updatedUser, localStorage.getItem("accessToken") || "");

      navigate("/home");
    } catch (error) {
      console.error("Failed to complete profile:", error);
    }
  };

  return (
    <div className="w-full min-h-screen grid place-items-center bg-light px-4 sm:px-6">
      <header className="w-full max-w-lg px-4 sm:px-6 my-6 md:my-10 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold flex items-center justify-center gap-2 md:gap-4 whitespace-nowrap mb-2 md:mb-4">
          <span>Welcome to</span>
          <img
            src={logo}
            alt="Travel Saathi"
            className="w-32 sm:w-40 md:w-56 h-auto"
          />
        </h1>
        <p className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
          Let's Complete Your Profile
        </p>
      </header>

      <main className="w-full max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 bg-white rounded-md sm:rounded-lg md:rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : avatarPlaceholder
              }
              alt="Profile Avatar"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
            />
          </label>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Input
            label="Full Name"
            name="fullName"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />

          <Input
            label="Username"
            name="username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />

          <Input
            label="Contact Number"
            name="contactNumber"
            id="contactNumber"
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Enter your contact number"
          />

          <Input
            label="Email"
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />

          <Dropdown
            label="I am based out of"
            placeholder="Home city"
            value={`${location.city}, ${location.state}, ${location.country}`}
            icon={<MapPin />}
            onChange={handleLocationChange}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm sm:text-base font-semibold">
              My Gender
            </span>
            <div className="flex gap-4">
              <GenderRadioGroup
                selectedGender={gender}
                onGenderChange={setGender}
              />
            </div>
          </div>

          <Textarea
            name="about"
            id="about"
            label="About"
            placeholder="Tell us about yourself..."
            value={about}
            rows={4}
            onChange={(e) => setAbout(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
          >
            Get Started
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CompleteProfile;
