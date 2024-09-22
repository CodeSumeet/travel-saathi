import { FC, useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

interface Location {
  city: string;
  state: string;
  country: string;
}

interface DropdownProps {
  label: string;
  value: string;
  icon: JSX.Element;
  onChange: (location: Location) => void;
  placeholder: string;
}

const Dropdown: FC<DropdownProps> = ({
  label,
  value,
  icon,
  onChange,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLocations = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 3) {
        setLocations([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: searchTerm,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
          }
        );

        const filteredLocations = response.data
          .map((item: any) => ({
            city:
              item.address.city ||
              item.address.town ||
              item.address.village ||
              item.name,
            state: item.address.state || item.address.state_district || "",
            country: item.address.country || "",
          }))
          .filter(
            (location: Location) =>
              location.city && location.state && location.country
          );

        setLocations(filteredLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      fetchLocations(searchTerm);
    } else {
      setLocations([]);
    }
  }, [searchTerm, fetchLocations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (location: Location) => {
    const fullLocation = formatLocation(location);
    setSearchTerm(fullLocation);
    onChange(location);
    setIsOpen(false);
  };

  const formatLocation = (location: Location) => {
    return `${location.city}, ${location.state}, ${location.country}`;
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
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="w-full px-3 py-2 bg-light border border-grey rounded-md placeholder:text-grey text-sm sm:text-base md:text-sm lg:text-base focus:outline-none focus:ring-1"
          />
          <figure className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-grey">
            {icon}
          </figure>
        </div>
        {isOpen && (
          <ul className="absolute w-full mt-1 bg-white border border-grey rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {isLoading ? (
              <li className="px-3 py-2 text-grey">Loading...</li>
            ) : locations.length > 0 ? (
              locations.map((location, index) => (
                <li
                  key={index}
                  onMouseDown={() => handleOptionClick(location)}
                  className={`px-3 py-2 cursor-pointer hover:bg-light-grey ${
                    value === formatLocation(location) ? "bg-light-grey" : ""
                  }`}
                >
                  {formatLocation(location)}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-grey">No locations found</li>
            )}
          </ul>
        )}
      </div>
    </label>
  );
};

export default Dropdown;
