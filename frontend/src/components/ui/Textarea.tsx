import { FC, TextareaHTMLAttributes } from "react";

interface TextareaProps {
  name: string;
  id: string;
  label: string;
  placeholder: string;
  value: TextareaHTMLAttributes<HTMLTextAreaElement>["value"];
  onChange: TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"];
  disabled?: boolean;
  rows?: number; // Optional: number of rows for the textarea
}

const Textarea: FC<TextareaProps> = ({
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  rows = 4, // Default rows, adjust as needed
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-semibold text-sm sm:text-base md:text-sm lg:text-base"
      >
        {label}
      </label>
      <textarea
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2 bg-light border border-grey rounded-md placeholder:text-grey text-sm sm:text-base md:text-sm lg:text-base focus:outline-none focus:ring-1 ${
          disabled
            ? "bg-gray-200 border-gray-300 text-gray-500 opacity-75 cursor-not-allowed"
            : ""
        }`}
      />
    </div>
  );
};

export default Textarea;
