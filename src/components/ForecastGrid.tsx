import React from "react";

interface Forecast {
  day: string;
  temp: number;
  icon: string;
}

interface ForecastGridProps {
  forecast: Forecast[] | undefined;
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return <div>No forecast data available</div>;

  return (
    <div className="flex flex-row justify-between gap-4 bg-white rounded-2xl shadow-md border p-4 mt-4 overflow-x-auto">
      <p className="text-xl font-semibold text-blue-700 mb-4">3-Day Forecast</p>
      {forecast.map((day, index) => (
        <div
          key={index}
          className="flex-shrink-0 flex flex-col items-center border rounded-xl p-3 min-w-[100px] text-center transition hover:scale-105 hover:shadow-lg"
        >
          <p className="font-medium text-blue-600">{day.day}</p>
          <img
            src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
            alt="forecast icon"
            className="h-16 w-16"
          />
          <p className="text-lg">{day.temp.toFixed(1)}°</p>
        </div>
      ))}
    </div>
  );
};

export default ForecastGrid;
