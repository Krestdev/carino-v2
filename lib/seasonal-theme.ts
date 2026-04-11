// lib/seasonalTheme.ts
export type SeasonalTheme = "default" | "christmas" | "newyear";

export function getSeasonalTheme(): SeasonalTheme {
    const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // Noël : du 1 au 26 décembre
  if (month === 11 && day <= 30 && day >= 1) {
    return "christmas";
  }

  // Nouvel an : du 27 décembre au 5 janvier
  if ((month === 11 && day >= 30) || (month === 0 && day <= 15)) {
    return "newyear";
  }

  return "default";
}
