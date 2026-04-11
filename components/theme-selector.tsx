// components/SeasonalThemeBootstrap.tsx
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { getSeasonalTheme } from "@/lib/seasonal-theme";

export function ThemeActivator() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    const seasonal = getSeasonalTheme();

    // évite de set si c'est déjà le bon
    if (theme !== seasonal) {
      setTheme(seasonal);
    }
  }, [theme, setTheme]);

  return null; // pas d'UI, juste effet secondaire
}
