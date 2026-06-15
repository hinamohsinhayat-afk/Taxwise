"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalWarn = console.warn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Skipping auto-scroll behavior due to")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

