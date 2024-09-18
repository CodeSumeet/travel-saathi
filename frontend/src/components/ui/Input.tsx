import { FC, InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importing Smile icon for emoji button
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"; // Import emoji picker

interface InputProps {
  name: string;
  id: string;
  label?: string;
  placeholder?: string;
  value: InputHTMLAttributes<HTMLInputElement>["value"];
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  disabled?: boolean;
  icon?: ReactNode; // Optional icon prop
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
  icon, // Destructure the icon prop
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    // Append the selected emoji to the input value
    const newValue = value + emojiData.emoji;
    onChange!({
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
        {icon && (
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute left-2 flex items-center"
            style={{ background: "transparent", border: "none" }}
          >
            {icon}
          </button>
        )}
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-3 py-2 bg-light border border-grey rounded-md placeholder:text-grey text-sm sm:text-base md:text-sm lg:text-base focus:outline-none focus:ring-1 ${
            disabled
              ? "bg-gray-200 border-gray-300 text-gray-500 opacity-75 cursor-not-allowed"
              : ""
          } ${icon ? "pl-10" : "pl-3"}`} // Adjust padding based on icon presence
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
