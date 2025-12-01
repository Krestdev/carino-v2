"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
    selectedTheme: "christmas"| "newyear";
}

export function UseOnTheme({ children, selectedTheme }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (theme !== selectedTheme) return null;

  return children;
}
