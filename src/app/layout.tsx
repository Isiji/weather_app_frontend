import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Weather App",
  description: "Get current weather and forecast",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
