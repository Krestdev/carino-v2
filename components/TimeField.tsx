"use client";

import {
  TimePicker,
  TimePickerContent,
  TimePickerInput,
  type TimePickerI18nOverrides,
} from "@/components/reui/time-picker";
import { cn } from "@/lib/utils";

const FR: TimePickerI18nOverrides = {
  labels: {
    placeholder: "Choisir une heure",
    hour: "Heure",
    minute: "Minute",
    second: "Seconde",
    now: "Maintenant",
    clear: "Effacer",
    confirm: "OK",
    panelLabel: "Choisir une heure",
    openPicker: "Ouvrir le sélecteur d'heure",
  },
};

/** Apparence alignée sur les autres champs du site (Input, SelectTrigger) */
const FIELD_CLASS = cn(
  "h-9 rounded-none border-0 border-b shadow-xs",
  // Même effet de focus que les champs du site
  "has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
  // Icône horloge discrète, comme la flèche des selects
  "[&_[data-slot=time-picker-input-trigger]]:text-muted-foreground",
  "bg-[#F3F4F6] border-[#4B5563] [&_input]:placeholder:text-muted-foreground"
);

const pad = (n: number) => String(n).padStart(2, "0");

/** Date → "HH:mm" */
export const toTimeValue = (date?: Date | null) =>
  date ? `${pad(date.getHours())}:${pad(date.getMinutes())}` : "";

/** "HH:mm" → nouvelle Date (jour de `base`, ou aujourd'hui) à cette heure */
export const fromTimeValue = (value: string, base?: Date | null) => {
  const [hours, minutes] = value.split(":").map(Number);
  const date = base ? new Date(base) : new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
};

/** Heure actuelle au format "HH:mm" */
export const nowTimeValue = () => toTimeValue(new Date());

/** Délai minimum entre la commande et l'heure demandée */
export const MIN_ORDER_DELAY_MINUTES = 60;
export const MIN_ORDER_DELAY_MESSAGE =
  "Veuillez définir une heure au moins une heure plus tard que l'heure actuelle";

/** true si "HH:mm" est au moins une heure après maintenant */
export const isAtLeastOneHourLater = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
  const now = new Date();
  return hours * 60 + minutes >= now.getHours() * 60 + now.getMinutes() + MIN_ORDER_DELAY_MINUTES;
};

/** Heure par défaut des commandes : dans une heure, arrondie aux 5 minutes supérieures (pas du sélecteur) */
export const defaultOrderTime = () => {
  const date = new Date(Date.now() + MIN_ORDER_DELAY_MINUTES * 60_000);
  const rounded = Math.ceil(date.getMinutes() / 5) * 5;
  date.setMinutes(rounded, 0, 0); // 60 passe automatiquement à l'heure suivante
  return toTimeValue(date);
};

/** Bornes des commandes, alignées sur la validation (heure ≥ ouverture et < heure de fermeture) */
export const ORDER_TIME_BOUNDS = (() => {
  const open = Number((process.env.NEXT_PUBLIC_OPENTIME || "11:00").split(":")[0]);
  const close = Number((process.env.NEXT_PUBLIC_CLOSETIME || "22:00").split(":")[0]);
  return { min: `${pad(open)}:00`, max: `${pad(close - 1)}:55` };
})();

/** Réservations : de midi à 21h (dernière heure acceptée par la validation) */
export const RESERVATION_TIME_BOUNDS = { min: "12:00", max: "21:55" };

interface TimeFieldProps {
  /** "HH:mm" en 24 h, ou vide */
  value?: string | null;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  id?: string;
  invalid?: boolean;
  placeholder?: string;
  className?: string;
}

/** Sélecteur d'heure des restaurants (ReUI) : saisie libre (930, 14:30…) + colonnes, pas de 5 min. */
export function TimeField({
  value,
  onChange,
  min,
  max,
  id,
  invalid,
  placeholder = "--:--",
  className,
}: TimeFieldProps) {
  return (
    <TimePicker
      id={id}
      value={value || null}
      onValueChange={(next) => onChange(next ?? "")}
      hourCycle={24}
      minuteStep={5}
      min={min}
      max={max}
      invalid={invalid}
      i18n={FR}
      className={className}
    >
      <TimePickerInput placeholder={placeholder} digitMask className={FIELD_CLASS} />
      <TimePickerContent align="end" />
    </TimePicker>
  );
}
