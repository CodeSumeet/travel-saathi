import { FC, useState } from "react";

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  icon: JSX.Element;
  onChange: (value: string) => void;
  placeholder: string;
}

const Dropdown: FC<DropdownProps> = ({
  label,
  options,
  value,
  icon,
  onChange,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option: string) => {
    setSearchTerm(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm sm:text-base font-semibold">{label}</span>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true); // Open dropdown on typing
            }}
            onFocus={() => setIsOpen(true)} // Keep dropdown open on focus
            className="w-full px-3 py-2 bg-light border border-grey rounded-md placeholder:text-grey text-sm sm:text-base md:text-sm lg:text-base focus:outline-none focus:ring-1"
          />
          <figure className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-grey">
            {icon}
          </figure>
        </div>
        {isOpen && (
          <ul className="absolute w-full mt-1 bg-white border border-grey rounded-md shadow-lg z-10">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  onMouseDown={() => handleOptionClick(option)}
                  className={`px-3 py-2 cursor-pointer hover:bg-light-grey ${
                    value === option ? "bg-light-grey" : ""
                  }`}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-grey">No options found</li>
            )}
          </ul>
        )}
      </div>
    </label>
  );
};

export default Dropdown;
