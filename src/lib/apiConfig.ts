import { Capacitor } from "@capacitor/core";

/**
 * Cloud Backend URL Configuration & Resolver
 * Enables seamless API routing from native mobile APK containers
 * to the deployed Cloud Run backend server.
 */

const CLOUD_FALLBACK_URL = "https://ais-dev-esnqt5uw3zvrzqrsduwy5u-543927946609.us-west2.run.app";

export function getBaseApiUrl(): string {
  // If running inside Capacitor native mobile platform (Android APK)
  if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
    const configuredUrl = (import.meta as any).env?.VITE_SERVER_URL;
    return (configuredUrl || CLOUD_FALLBACK_URL).replace(/\/$/, "");
  }

  // If in browser / local dev
  const customUrl = (import.meta as any).env?.VITE_SERVER_URL;
  if (customUrl && typeof customUrl === "string" && customUrl.startsWith("http")) {
    return customUrl.replace(/\/$/, "");
  }

  return "";
}

export function getApiUrl(path: string): string {
  const base = getBaseApiUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalizedPath}` : normalizedPath;
}
