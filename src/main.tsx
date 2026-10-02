// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const log = (...args: any[]) => {
  try { console.info("[VERCEL-INSTRUMENT]", ...args); } catch {}
};

// Speed Insights
if (typeof window !== "undefined") {
  import("@vercel/speed-insights")
    .then(({ injectSpeedInsights }) => {
      try {
        injectSpeedInsights();
        log("Speed Insights: injectSpeedInsights() called");
      } catch (e) {
        console.error("Speed Insights: injectSpeedInsights() error:", e);
      }
    })
    .catch((err) => {
      console.error("Speed Insights import failed:", err);
    });
}

// Analytics
if (typeof window !== "undefined") {
  import("@vercel/analytics")
    .then(({ inject }) => {
      try {
        inject();
        log("Analytics: inject() called");
      } catch (e) {
        console.error("Analytics: inject() error:", e);
      }
    })
    .catch((err) => {
      console.error("Analytics import failed:", err);
    });
}

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
