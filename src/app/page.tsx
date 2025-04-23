"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (!city.trim()) return;
    console.log("Searching for:", city);
    // We will implement the API fetch in the next step
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
