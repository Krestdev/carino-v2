export const statusLabel = (status: string) => {
    switch (status) {
        case "PAID":
            return "Payée";
        case "CONFIRMED":
            return "Confirmée";
        case "AWAITING_PAYMENT":
            return "En attente de paiement";
        case "CANCELLED":
            return "Annulée";
        case "COMPLETED":
            return "Terminée";
        case "REFUNDED":
            return "Remboursée";
        case "SYNC_FAILED":
            return "Échec de synchronisation";
        default:
            return status;
    }
};

export const statusBadgeClass = (status: string) => {
    switch (status) {
        case "PAID":
        case "CONFIRMED":
        case "COMPLETED":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "AWAITING_PAYMENT":
            return "bg-amber-50 text-amber-700 border-amber-200";
        case "CANCELLED":
            return "bg-rose-50 text-rose-700 border-rose-200";
        case "REFUNDED":
            return "bg-purple-50 text-purple-700 border-purple-200";
        case "SYNC_FAILED":
            return "bg-orange-50 text-orange-700 border-orange-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};
