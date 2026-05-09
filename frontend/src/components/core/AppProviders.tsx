"use client";
import React, { useEffect, useState } from "react";
import { useConfigStore } from "@/lib/store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { loadConfig, loadUser, setLocale, locale, config } = useConfigStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await loadConfig();
      // Load user if token exists
      const token = localStorage.getItem("cr_token");
      if (token) {
        await loadUser();
      }
      setInitialized(true);
    })();
  }, []);

  // Load translations when config arrives
  useEffect(() => {
    if (config?.i18n?.enabled) {
      setLocale(locale);
    }
  }, [config?.i18n?.enabled]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-sm text-gray-400">Loading platform...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
