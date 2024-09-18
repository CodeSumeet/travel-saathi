import { FC, useState } from "react";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import FileUpload from "../components/ui/FileUpload";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";

const ShareExperience: FC = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !location || !description || !selectedFile) {
      // Handle validation
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("userId", user.id); // Assuming user.id contains the UUID
    formData.append("location", location);
    formData.append("description", description);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const response = await apiClient.post("/posts/create-post", formData);

      // Handle successful post creation, e.g., redirect or show a success message
      console.log(response);
    } catch (error) {
      // Handle error, e.g., show error message
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = () => {
    setLocation("");
    setDescription("");
    setSelectedFile(null);
  };

  return (
    <div className="">
      <main className="h-[calc(100vh-4rem)] sm:h-screen mx-auto overflow-y-scroll">
        <div className="w-full h-auto min-h-screen mx-auto max-w-lg bg-white shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold text-center mb-8 sm:mb-12">
            Share Your Experience with the Whole World
          </h1>

          <form
            onSubmit={handlePost}
            className="flex flex-col gap-8"
          >
            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
            />

            <Input
              label="Location"
              name="location"
              id="location"
              placeholder="Type to add location..."
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Textarea
              label="Description"
              name="description"
              id="description"
              placeholder="Share stories about your experience with buddies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex flex-row gap-4">
              <Button
                type="button"
                className="text-sm sm:text-base flex-1"
                onClick={handleDiscard}
                disabled={isLoading}
              >
                Discard
              </Button>
              <Button
                type="submit"
                className="text-sm sm:text-base flex-1"
                loading={isLoading}
              >
                Post
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ShareExperience;
