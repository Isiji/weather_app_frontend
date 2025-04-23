"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define types for weather data
type WeatherData = {
  weather: string;
  icon: string;
  city: string;
  units: string;
  temperature: number;
  date: string;
  windSpeed: number;
  humidity: number;
  forecast: {
    day: string;
    temp: number;
    icon: string;
  }[];
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Handle city search
  const handleSearch = async () => {
    if (!city.trim()) return;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`;

    try {
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.length) {
        console.log("City not found");
        return;
      }

      const { lat, lon, name, country } = geoData[0];
      console.log(`Coordinates of ${name}, ${country}:`, { lat, lon });

      const backendUrl = `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}&city=${name}&units=metric`;
      const weatherRes = await fetch(backendUrl);
      const weatherData: WeatherData = await weatherRes.json();

      console.log("Weather from backend:", weatherData);
      setWeather(weatherData);
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        {/* Top bar with search and temperature unit toggle */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Enter city name"
            value={city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCity(e.target.value)
            }
            className="flex-1"
          />
          <Button onClick={handleSearch}>Search</Button>
          {/* Unit toggle: Celsius/Fahrenheit */}
          <Button onClick={() => console.log("Switch unit")} className="ml-2">
            °C/°F
          </Button>
        </div>

        {/* Weather information section */}
        {weather && (
          <div className="flex justify-between items-start gap-4">
            {/* Left section: Icon, Temperature, Description */}
            <div className="flex flex-col items-start">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.weather}
                className="w-16 h-16 mb-4"
              />
              <p className="text-xl font-semibold">{weather.temperature}°</p>
              <p className="text-lg">{weather.weather}</p>
            </div>

            {/* Right section: Date and Location */}
            <div className="flex flex-col items-end">
              <p className="text-md font-semibold">{weather.city}</p>
              <p className="text-sm">{weather.date}</p>
            </div>
          </div>
        )}

        {/* 3-Day Forecast Section */}
        {weather && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.day}
                  className="w-12 h-12 mx-auto mb-2"
                />
                <p>{day.day}</p>
                <p>{day.temp}°</p>
              </div>
            ))}
          </div>
        )}

        {/* Wind and Humidity Information */}
        {weather && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="mr-2">💨</span>
                <p>Wind Speed: {weather.windSpeed} m/s</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💧</span>
                <p>Humidity: {weather.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
