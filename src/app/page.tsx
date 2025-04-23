"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ✅ Define the type for weather response
type WeatherData = {
  weather: string;
  icon: string;
  city: string;
  units: string;
};

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null); // ✅ Type added

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
        <h1 className="text-3xl font-bold text-center mb-6">Weather App</h1>

        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter city name"
            value={city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCity(e.target.value)
            }
            className="flex-1"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* ✅ Display weather data if available */}
        {weather && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <p className="text-lg font-semibold">Weather: {weather.weather}</p>

            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.weather}
              className="mx-auto mb-2"
            />
            <p className="text-gray-700">City: {weather.city}</p>
            <p className="text-gray-700">Units: {weather.units}</p>
          </div>
        )}
      </div>
    </main>
  );
}
