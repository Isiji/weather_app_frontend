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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalDate(new Date().toLocaleDateString());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const unit = isFahrenheit ? "imperial" : "metric";

          try {
            setLoading(true);
            setError(null);
            const res = await fetch(
              `http://127.0.0.1:8000/api/weather?lat=${latitude}&lon=${longitude}&units=${unit}`
            );
            
            if (!res.ok) {
              throw new Error(`API error: ${res.status}`);
            }
            
            const data = await res.json();
            setWeatherData(data);
          } catch (err) {
            console.error("Auto-detect weather failed:", err);
            setError("Failed to detect location weather. Please try searching for a city.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          setError("Location access denied. Please search for a city instead.");
        }
      );
    }
  }, [isFahrenheit]);

  const handleSearch = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // First, verify that API key is available
      if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
        throw new Error("API key not configured");
      }
      
      // Make the geo API call
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      
      if (!geoRes.ok) {
        throw new Error(`Geo API error: ${geoRes.status}`);
      }
      
      const geoData = await geoRes.json();
      
      if (!geoData || geoData.length === 0) {
        setError(`City "${city}" not found. Please check the spelling and try again.`);
        setLoading(false);
        return;
      }
      
      const { lat, lon } = geoData[0];
      const unit = isFahrenheit ? "imperial" : "metric";

      // Make the weather API call
      const res = await fetch(
        `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}&units=${unit}&city=${city}`
      );
      
      if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
      }
      
      const data = await res.json();
      setWeatherData(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      
      if (err.message === "API key not configured") {
        setError("API key not configured. Please add your OpenWeather API key to the environment variables.");
      } else if (err.message.includes("Geo API error")) {
        setError("Error connecting to weather service. Please try again later.");
      } else {
        setError(`Failed to fetch weather data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100 p-6 font-sans transition-all">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Weather Dashboard</h1>
        
        <div className="flex flex-row gap-6 overflow-x-auto pb-2">
          {/* Left Column - Today's Weather */}
          <section className="w-1/3 min-w-72 bg-white/95 border border-blue-200 rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition duration-300">
            <h2 className="text-2xl font-bold mb-6 tracking-wide text-blue-700">Today's Weather</h2>
            <div className="mb-4">
              <img
                src={weatherData?.icon ? `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png` : "/placeholder-icon.png"}
                alt="Weather Icon"
                className="w-32 mx-auto"
              />
            </div>
            <h2 className="text-5xl font-extrabold text-gray-800 mb-2">
              {weatherData ? `${weatherData.temperature}°${isFahrenheit ? "F" : "C"}` : "--"}
            </h2>
            <p className="text-xl capitalize text-gray-600 mb-6">{weatherData?.weather ?? "Description"}</p>
            <div className="text-sm text-gray-600 mt-4 p-4 bg-blue-50 rounded-xl w-full">
              <p className="mb-1">{weatherData?.date ?? localDate}</p>
              <p className="font-medium text-gray-700 text-lg">{weatherData?.city ?? "City, Country"}</p>
            </div>
          </section>

          {/* Right Column - Controls and Details */}
          <section className="w-2/3 flex flex-col gap-6">
            {/* Search + Toggle Row */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between items-center gap-6 bg-white/90 border border-blue-200 rounded-xl shadow p-5">
                {/* Search */}
                <div className="flex w-3/4 gap-3">
                  <Input
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-base"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6"
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 py-2 px-4 rounded-xl shadow-sm hover:shadow transition">
                  <span className="text-sm font-semibold text-gray-700">°C</span>
                  <Switch checked={isFahrenheit} onCheckedChange={setIsFahrenheit} />
                  <span className="text-sm font-semibold text-gray-700">°F</span>
                </div>
              </div>
              
              {/* Error message display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>

            {/* Forecast */}
            <div className="bg-white/95 border border-blue-200 rounded-2xl shadow p-6 hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-5 text-blue-700 border-b border-blue-100 pb-2">3-Day Forecast</h3>
              <div className="grid grid-cols-3 gap-6 mt-4">
                {(weatherData?.forecast || Array(3).fill(null)).map((day: Forecast | null, index: number) => (
                  <div key={index} className="text-center p-4 bg-blue-50 rounded-xl hover:scale-105 transition-transform hover:bg-blue-100">
                    <p className="text-base font-medium text-gray-700 mb-2">{day?.day ?? "--"}</p>
                    <img
                      src={day?.icon ? `https://openweathermap.org/img/wn/${day.icon}@2x.png` : "/forecast-icon.png"}
                      alt="icon"
                      className="mx-auto w-16 my-2"
                    />
                    <p className="text-lg font-medium">{day ? `${day.temp}°` : "--"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wind and Humidity Details */}
            <div className="bg-white/95 border border-blue-200 rounded-2xl shadow p-6 hover:shadow-lg transition">
              <h3 className="text-2xl font-semibold mb-5 text-blue-700 border-b border-blue-100 pb-2">Weather Details</h3>
              <div className="flex justify-around mt-4">
                <div className="flex items-center gap-4 text-center p-4 bg-blue-50 rounded-xl w-2/5">
                  <WiStrongWind size={42} className="text-blue-600" />
                  <div>
                    <p className="text-base text-gray-500 mb-1">Wind Speed</p>
                    <p className="font-bold text-gray-800 text-xl">{weatherData?.windSpeed ?? "--"} m/s</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-center p-4 bg-blue-50 rounded-xl w-2/5">
                  <WiHumidity size={42} className="text-blue-600" />
                  <div>
                    <p className="text-base text-gray-500 mb-1">Humidity</p>
                    <p className="font-bold text-gray-800 text-xl">{weatherData?.humidity ?? "--"}%</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Weather data powered by OpenWeather API</p>
        </footer>
      </div>
    </main>
  );
}