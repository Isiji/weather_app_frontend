"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/Switch";
import { WiStrongWind, WiHumidity } from "react-icons/wi";

interface Forecast {
  day: string;
  temp: number;
  icon: string;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [localDate, setLocalDate] = useState("");

  useEffect(() => {
    setLocalDate(new Date().toLocaleDateString());
  }, []);

  const handleSearch = async () => {
    if (!city) return;

    setLoading(true);
    try {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const geoData = await geoRes.json();
      const { lat, lon } = geoData[0];

      const unit = isFahrenheit ? "imperial" : "metric";

      const res = await fetch(
        `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}&units=${unit}&city=${city}`
      );
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-200 via-sky-100 to-blue-100 p-6 grid grid-cols-3 gap-4 font-sans transition-all">

      {/* Left Column */}
      <section className="col-span-1 flex flex-col justify-between bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
        <div className="text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-4 tracking-wide text-blue-700">Today's Weather</h2>
          <img
            src={weatherData?.icon ? `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png` : "/placeholder-icon.png"}
            alt="Weather Icon"
            className="mx-auto mb-2 w-24"
          />
          <h2 className="text-4xl font-extrabold text-gray-800">
            {weatherData ? `${weatherData.temperature}°${isFahrenheit ? "F" : "C"}` : "--"}
          </h2>
          <p className="text-lg capitalize text-gray-600">{weatherData?.weather ?? "Description"}</p>
        </div>
        <div className="text-sm text-gray-600 text-center mt-6">
          <p>{weatherData?.date ?? localDate}</p>
          <p className="font-medium text-gray-700">{weatherData?.city ?? "City, Country"}</p>
        </div>
      </section>

      {/* Center Column */}
      <section className="col-span-1 flex flex-col gap-4 animate-fade-in">
        <h1 className="text-2xl font-extrabold text-blue-800 text-center mb-2">Weather Forecaster</h1>

        {/* Search Bar */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>{loading ? "Searching..." : "Search"}</Button>
        </div>

        {/* Forecast */}
        <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">3-Day Forecast</h3>
          <div className="grid grid-cols-3 gap-4">
            {(weatherData?.forecast || Array(3).fill(null)).map((day: Forecast | null, index: number) => (
              <div key={index} className="text-center hover:scale-105 transition-transform">
                <p className="text-sm text-gray-500">{day?.day ?? "--"}</p>
                <img
                  src={day ? `https://openweathermap.org/img/wn/${day.icon}@2x.png` : "/forecast-icon.png"}
                  alt="icon"
                  className="mx-auto w-12"
                />
                <p className="text-base font-medium">{day ? `${day.temp}°` : "--"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Details</h3>
          <div className="flex justify-around">
            <div className="flex items-center gap-2 text-center">
              <WiStrongWind size={28} className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Wind</p>
                <p className="font-medium text-gray-800">{weatherData?.windSpeed ?? "--"} m/s</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-center">
              <WiHumidity size={28} className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-medium text-gray-800">{weatherData?.humidity ?? "--"}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Column - Toggle */}
      <section className="col-span-1 flex justify-end items-start">
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition">
          <span className="text-sm font-semibold text-gray-700">°C</span>
          <Switch checked={isFahrenheit} onCheckedChange={setIsFahrenheit} />
          <span className="text-sm font-semibold text-gray-700">°F</span>
        </div>
      </section>
    </main>
  );
}
