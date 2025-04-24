import React from "react";
import { Wind, Droplet } from "lucide-react";

interface WeatherDetailsProps {
  windSpeed?: number;
  humidity?: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ windSpeed, humidity }) => {
  if (windSpeed == null || humidity == null) return null;

  return (
    <div className="flex gap-4 w-full">
      {/* Wind Speed Box */}
      <div className="flex-1 bg-white border rounded-2xl shadow-md p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wind className="w-5 h-5 text-blue-500" />
          <p className="text-sm text-gray-600">Wind Speed</p>
        </div>
        <p className="text-xl font-medium">{windSpeed} m/s</p>
      </div>

      {/* Humidity Box */}
      <div className="flex-1 bg-white border rounded-2xl shadow-md p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Droplet className="w-5 h-5 text-blue-500" />
          <p className="text-sm text-gray-600">Humidity</p>
        </div>
        <p className="text-xl font-medium">{humidity}%</p>
      </div>
    </div>
  );
};

export default WeatherDetails;
