import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isClosed() {
  const currentDate = new Date();
  const africaDate = new Date(
    currentDate.toLocaleString("en-US", { timeZone: "Africa/Algiers" })
  );
  const isOpen = africaDate.getHours() >= 10.5 && africaDate.getHours() < 20.5;
  return !isOpen;
}

export function is8march() {
  const maintenant = new Date();
  const mois = maintenant.getUTCMonth() + 1; // Mois (de 1 à 12)
  const jour = maintenant.getUTCDate(); // Jour du mois

  // Vérifier si c'est le 8 mars
  return mois === 3 && jour === 8;
}
