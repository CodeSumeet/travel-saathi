import { FC, InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff, Smile } from "lucide-react"; // Import Smile icon for emoji button
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"; // Import emoji picker

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  value: string; // Ensures the value is a string type
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Strict onChange typing
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  disabled?: boolean;
  icon?: ReactNode; // Optional icon prop
  enableEmoji?: boolean; // Optional emoji picker toggle
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Optional keydown event for "Enter" press
}

const Input: FC<InputProps> = ({
  name,
  id,
  label,
  placeholder,
  value,
  type,
  onChange,
  showPassword,
  togglePasswordVisibility,
  disabled = false,
  icon,
  enableEmoji = false, // New prop to control emoji picker
  onKeyDown, // Optional keydown event for handling Enter key
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    // Append the selected emoji to the input value
    const newValue = value + emojiData.emoji;
    onChange({
      target: { value: newValue },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowEmojiPicker(false); // Close the emoji picker after selection
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="font-semibold text-sm sm:text-base md:text-sm lg:text-base"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {enableEmoji && (
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-2 flex items-center"
            style={{ background: "transparent", border: "none" }}
          >
            <Smile className="text-grey" />
          </button>
        )}
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown} // Handle keydown for 'Enter' key
          disabled={disabled}
          className={`w-full px-3 py-2 bg-light border border-grey rounded-md placeholder:text-grey text-sm sm:text-base md:text-sm lg:text-base focus:outline-none focus:ring-1 ${
            disabled
              ? "bg-gray-200 border-gray-300 text-gray-500 opacity-75 cursor-not-allowed"
              : ""
          } ${enableEmoji ? "pl-10" : "pl-3"}`} // Adjust padding based on emoji picker presence
        />
        {name === "password" && togglePasswordVisibility && !disabled && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2"
          >
            {showPassword ? (
              <EyeOff className="text-grey" />
            ) : (
              <Eye className="text-grey" />
            )}
          </button>
        )}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
