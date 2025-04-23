"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [city, setCity] = useState("");

  const handleSearch = async () => {
    if (!city.trim()) return;
  
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.length === 0) {
        console.log("City not found");
        return;
      }
  
      const { lat, lon, name, country } = data[0];
      console.log(`Coordinates of ${name}, ${country}:`, { lat, lon });
    } catch (err) {
      console.error("Failed to fetch coordinates:", err);
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
      </div>
    </main>
  );
}
