import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  city: string;
  setCity: (val: string) => void;
  isFahrenheit: boolean;
  setIsFahrenheit: (val: boolean) => void;
  handleSearch: () => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  city,
  setCity,
  isFahrenheit,
  setIsFahrenheit,
  handleSearch,
  loading,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
        className="w-full"
      />
      <Button onClick={handleSearch} color="blue">
        {loading ? "Loading..." : "Search"}
      </Button>
      <Button
        color="gray"
        onClick={() => setIsFahrenheit(!isFahrenheit)}
        className="ml-2"
      >
        {isFahrenheit ? "°F" : "°C"}
      </Button>
    </div>
  );
};

export default SearchBar;
