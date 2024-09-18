import React, { useRef, ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";

interface FileUploadComponentProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadComponentProps> = ({
  selectedFile,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="w-full cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col flex-grow mr-4">
            <h2 className="text-sm sm:text-base font-semibold mb-1">
              Upload Photos/Videos
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Narrate a visual story of your travel experience!
            </p>
          </div>
          <ImagePlus className="w-8 h-8 flex-shrink-0" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*"
          className="hidden"
        />
      </div>
      {selectedFile && (
        <div className="mt-4">
          {selectedFile.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full rounded-lg"
            />
          ) : (
            <video
              src={URL.createObjectURL(selectedFile)}
              controls
              className="w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
