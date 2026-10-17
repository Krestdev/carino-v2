import { useSyncExternalStore } from "react";

// Même seuil que le breakpoint `md` de Tailwind
const QUERY = "(max-width: 767px)";

const subscribe = (callback: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

/** true sous le breakpoint `md` (version mobile). false côté serveur. */
export const useIsMobile = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
