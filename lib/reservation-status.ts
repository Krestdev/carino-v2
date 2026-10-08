// Statuts des réservations renvoyés par l'API.
// Cycle : Pending → (validate) Confirmed → (settle) Customer Settled → (complete) Complete.
// « Rejeter » et « Annuler » appellent tous deux /cancel → Cancelled (il n'existe pas de statut Rejected).
// L'API a été vue renvoyer « Complete » et « Completed » pour une réservation terminée : on accepte les deux.

export const RESERVATION_STATUSES = ["Pending", "Confirmed", "Customer Settled", "Complete", "Cancelled"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

/** Ramène un statut brut de l'API à un statut connu (ou le renvoie tel quel s'il est inconnu). */
export const normalizeReservationStatus = (status: string): ReservationStatus | string =>
    status === "Completed" ? "Complete" : status;

export const reservationStatusLabel = (status: string): string => {
    switch (normalizeReservationStatus(status)) {
        case "Pending": return "En attente";
        case "Confirmed": return "Confirmée";
        case "Customer Settled": return "Client installé";
        case "Complete": return "Terminée";
        case "Cancelled": return "Annulée";
        default: return status;
    }
};

export const reservationStatusBadgeClass = (status: string): string => {
    switch (normalizeReservationStatus(status)) {
        case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
        case "Confirmed": return "bg-blue-50 text-blue-700 border-blue-200";
        case "Customer Settled": return "bg-teal-50 text-teal-700 border-teal-200";
        case "Complete": return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Cancelled": return "bg-rose-50 text-rose-700 border-rose-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
};
