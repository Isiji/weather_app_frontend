"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/Switch"; // assuming RippleUI includes this

interface ForecastDay {
  day: string;
  temp: number;
  icon: string;
}

interface WeatherData {
  weather: string;
  icon: string;
  city: string;
  units: string;
  temperature: number;
  date: string;
  windSpeed: number;
  humidity: number;
  forecast: ForecastDay[];
}

export default function Home() {
  const [city, setCity] = useState("");
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) return;

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`;

    try {
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.length) return;

      const { lat, lon, name, country } = geoData[0];
      const units = isFahrenheit ? "imperial" : "metric";
      const backendUrl = `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}&city=${name},${country}&units=${units}`;

      const weatherRes = await fetch(backendUrl);
      const weatherData: WeatherData = await weatherRes.json();

      setWeather(weatherData);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <main className="min-h-screen bg-sky-100 p-6 grid grid-cols-3 gap-4">
      {/* Left Column - Current Weather */}
      <section className="col-span-1 flex flex-col justify-between p-4 bg-white rounded-xl shadow h-full">
        {weather ? (
          <>
            <div className="text-center">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="Weather Icon"
                className="mx-auto mb-2"
              />
              <h2 className="text-4xl font-bold">{weather.temperature}°{isFahrenheit ? "F" : "C"}</h2>
              <p className="text-lg">{weather.weather}</p>
            </div>
            <div className="text-sm text-gray-600 text-center">
              <p>{weather.date}</p>
              <p>{weather.city}</p>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">Search for a city</div>
        )}
      </section>

      {/* Center Column - Search + Forecast + Details */}
      <section className="col-span-1 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* 3-Day Forecast */}
        {weather && (
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">3-Day Forecast</h3>
            <div className="grid grid-cols-3 gap-4">
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-sm text-gray-500">{day.day}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt="icon"
                    className="mx-auto"
                  />
                  <p className="text-base font-medium">{day.temp}°{isFahrenheit ? "F" : "C"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wind & Humidity */}
        {weather && (
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-sm text-gray-500">Wind</p>
                <p>{weather.windSpeed} m/s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Humidity</p>
                <p>{weather.humidity}%</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Right Column - Temperature Switch */}
      <section className="col-span-1 flex justify-end items-start">
        <div className="flex items-center gap-2">
          <span className="text-sm">°C</span>
          <Switch checked={isFahrenheit} onCheckedChange={setIsFahrenheit} />
          <span className="text-sm">°F</span>
        </div>
      </section>
    </main>
  );
}
