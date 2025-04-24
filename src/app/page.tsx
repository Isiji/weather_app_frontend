"use client";

import { useState, useEffect } from "react";
import WeatherToday from "@/components/WeatherToday";
import SearchBar from "@/components/SearchBar";
import ForecastGrid from "@/components/ForecastGrid";
import WeatherDetails from "@/components/WeatherDetails";
import ErrorAlert from "@/components/ErrorAlert";

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
            console.log("Weather Data:", data); // Debugging: Check the structure of the response

            setWeatherData(data);
          } catch (err) {
            setError("Failed to detect location weather. Please try searching for a city.");
          } finally {
            setLoading(false);
          }
        },
        () => {
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
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          city
        )}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );

      if (!geoRes.ok) throw new Error(`Geo API error: ${geoRes.status}`);

      const geoData = await geoRes.json();
      if (!geoData || geoData.length === 0) {
        setError(`City "${city}" not found.`);
        setLoading(false);
        return;
      }

      const { lat, lon } = geoData[0];
      const unit = isFahrenheit ? "imperial" : "metric";

      const res = await fetch(
        `http://127.0.0.1:8000/api/weather?lat=${lat}&lon=${lon}&units=${unit}&city=${city}`
      );

      if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

      const data = await res.json();
      console.log("Weather Data:", data); // Debugging: Check the structure of the response

      setWeatherData(data);
    } catch (err: any) {
      if (err.message === "API key not configured") {
        setError("API key not configured.");
      } else {
        setError(`Failed to fetch weather data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-blue-100 p-6 font-sans transition-all">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Weather Dashboard</h1>

        <div className="flex flex-row gap-6 overflow-x-auto pb-2">
          <WeatherToday
            weatherData={weatherData}
            isFahrenheit={isFahrenheit}
            localDate={localDate}
          />

          <section className="w-2/3 flex flex-col gap-6">
            <SearchBar
              city={city}
              setCity={setCity}
              isFahrenheit={isFahrenheit}
              setIsFahrenheit={setIsFahrenheit}
              handleSearch={handleSearch}
              loading={loading}
            />

            {error && <ErrorAlert message={error} />}

            <ForecastGrid forecast={weatherData?.forecast} />

            <WeatherDetails
              windSpeed={weatherData?.windSpeed}
              humidity={weatherData?.humidity}
            />
          </section>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Weather data powered by OpenWeather API</p>
        </footer>
      </div>
    </main>
  );
}
