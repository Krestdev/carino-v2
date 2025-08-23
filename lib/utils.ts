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

export function isPromotion(start: Date, end: Date) {
  const maintenant = new Date();
  // Vérifier si c'est le 8 mars
  return (maintenant >= start && maintenant <= end);
}

export function isDeliveryOpen(startTime=process.env.NEXT_PUBLIC_OPENTIME||"10:30" , endTime=process.env.NEXT_PUBLIC_CLOSETIME ||"20:30"): boolean {
  // Get the current time in UTC and adjust for UTC+1
  const currentDate = new Date();
  const utcHours = currentDate.getUTCHours() + 1; // Add 1 hour for UTC+1
  const currentTime = utcHours * 100 + currentDate.getUTCMinutes();

  // Helper function to convert "HH:MM" to HHMM format
  function convertToHHMM(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 100 + minutes;
  }

  // Convert startTime and endTime to HHMM format
  const start = convertToHHMM(startTime);
  const end = convertToHHMM(endTime);

  // Check if the current time is within the delivery window
  return currentTime >= start && currentTime <= end;
}