import { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";
import { User, UserCheck } from "lucide-react";

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: JSX.Element;
  selected?: boolean;
}

const RadioButton: FC<RadioButtonProps> = ({
  label,
  icon,
  selected = false,
  className,
  ...props
}) => {
  const baseStyles =
    "flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base font-base border border-gray-300 rounded-lg cursor-pointer transition duration-150 ease-in-out";

  const selectedStyles = selected
    ? "bg-deepRed text-white border border-grey"
    : "bg-white text-gray-800 border border-grey hover:bg-gray-100";

  return (
    <label className={clsx(baseStyles, selectedStyles, className)}>
      <input
        type="radio"
        className="sr-only"
        {...props}
      />
      {icon}
      <span>{label}</span>
    </label>
  );
};

const GenderRadioGroup: FC<{
  selectedGender: string;
  onGenderChange: (gender: string) => void;
}> = ({ selectedGender, onGenderChange }) => {
  return (
    <div className="flex gap-4">
      <RadioButton
        label="Male"
        icon={<User className="text-current" />} // General user icon for male
        selected={selectedGender === "male"}
        onClick={() => onGenderChange("male")}
      />
      <RadioButton
        label="Female"
        icon={<UserCheck className="text-current" />} // User with checkmark for female
        selected={selectedGender === "female"}
        onClick={() => onGenderChange("female")}
      />
    </div>
  );
};

export default GenderRadioGroup;
