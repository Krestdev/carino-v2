import { cartItem, Item } from "@/types/types";
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

// Format items from order

export function parseItems(items: string): Item[] {
  if (!items) return [];

  // 🟢 Supprimer les suffixes corrompus comme ...1
  let safe = items.replace(/\.\.\.\d+$/, "");

  // Supprimer les caractères parasites type newlines
  safe = safe.replace(/\n/g, "").trim();

  let rawItems: string[] = [];
  try {
    rawItems = JSON.parse(safe);
  } catch {
    console.error("Impossible de parser items:", items);
    return [];
  }

  return rawItems.map((raw) => {
    let cleaned = raw.trim();

    // 🟢 Ignorer prix du plat (-> 1234 à la fin)
    cleaned = cleaned.replace(/\s*->\s*\d+$/, "").trim();

    // Extraire nom + détails
    const match = cleaned.match(/^(.*?)\s*\((.*?)\)$/);
    if (!match) {
      return { name: cleaned, details: [] };
    }

    const [, name, inside] = match;
    if (!inside.trim()) {
      return { name: name.trim(), details: [] };
    }

    const details = inside
      .split(/[;,]/) // séparateur ; ou ,
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        // 🟢 Supprimer un éventuel prix dans le détail (= 1234)
        d = d.replace(/\s*=\s*\d+$/, "").trim();

        // Extraire quantité avec X
        const m = d.match(/^(.*?)(?:\s*[xX]\s*(\d+))?$/);
        return {
          name: m ? m[1].trim() : d,
          quantity: m && m[2] ? parseInt(m[2], 10) : 1,
        };
      });

    return { name: name.trim(), details };
  });
}

export function normalizeText(text: string): string {
  const cleaned = text.trim().toLowerCase();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export function CartTotal(cart: Array<cartItem>):number{
  return cart.reduce((accumulator, item) => accumulator + item.price * item.qte,
          0)
}