"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/Switch"; // assuming RippleUI includes this

export default function Home() {
  const [city, setCity] = useState("");
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  return (
    <main className="min-h-screen bg-sky-100 p-6 grid grid-cols-3 gap-4">
      {/* Left Column - Current Weather */}
      <section className="col-span-1 flex flex-col justify-between p-4 bg-white rounded-xl shadow h-full">
        <div className="text-center">
          <img src="/placeholder-icon.png" alt="Weather Icon" className="mx-auto mb-2" />
          <h2 className="text-4xl font-bold">21°C</h2>
          <p className="text-lg">Light Rain</p>
        </div>
        <div className="text-sm text-gray-600 text-center">
          <p>{new Date().toLocaleDateString()}</p>
          <p>Nairobi, KE</p>
        </div>
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
          <Button>Search</Button>
        </div>

        {/* 3-Day Forecast */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">3-Day Forecast</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Repeat this card for 3 days */}
            <div className="text-center">
              <p className="text-sm text-gray-500">Wed</p>
              <img src="/forecast-icon.png" alt="icon" className="mx-auto" />
              <p className="text-base font-medium">22°C</p>
            </div>
          </div>
        </div>

        {/* Wind & Humidity */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-500">Wind</p>
              <p>5.2 m/s</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Humidity</p>
              <p>75%</p>
            </div>
          </div>
        </div>
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
