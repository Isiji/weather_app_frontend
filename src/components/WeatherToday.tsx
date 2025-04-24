import React from "react";

interface WeatherTodayProps {
  weatherData: any;
  isFahrenheit: boolean;
  localDate: string;
}

const WeatherToday: React.FC<WeatherTodayProps> = ({
  weatherData,
  isFahrenheit,
  localDate,
}) => {
  const temperature =
    typeof weatherData?.temperature === "number"
      ? `${weatherData.temperature.toFixed(1)}° ${isFahrenheit ? "F" : "C"}`
      : "N/A";

  const description =
    weatherData?.weather ?? "No description";

  const icon = weatherData?.icon;

  const city =
    weatherData?.city ?? "Unknown City";

  return (
    <section className="w-1/3 bg-white rounded-2xl shadow-md p-4 min-w-[260px] border">
      {weatherData ? (
        <div className="flex flex-col items-center">
          {icon && (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt="weather icon"
              className="h-24 w-24"
            />
          )}
          <p className="text-3xl font-semibold">{temperature}</p>
          <p className="capitalize text-blue-700">{description}</p>
          <p className="text-sm text-gray-500">{localDate}</p>
          <p className="text-lg font-medium mt-1">{city}</p>
        </div>
      ) : (
        <div className="text-center text-gray-500 italic">No weather data</div>
      )}
    </section>
  );
};

export default WeatherToday;
