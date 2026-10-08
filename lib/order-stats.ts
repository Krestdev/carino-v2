import type { AdminOrderListItem } from "@/types/types";

/** Nombre max de commandes chargées pour calculer les statistiques (la liste, elle, est paginée). */
export const ORDER_STATS_LIMIT = 1000;

const PAID_STATUSES = ["PAID", "CONFIRMED", "COMPLETED"];

export function computeOrderStats(orders: AdminOrderListItem[]) {
    const paid = orders.filter((order) => PAID_STATUSES.includes(order.status));
    return {
        paid: paid.length,
        awaitingPayment: orders.filter((order) => order.status === "AWAITING_PAYMENT").length,
        syncFailed: orders.filter((order) => order.status === "SYNC_FAILED").length,
        revenue: paid.reduce((sum, order) => sum + Number(order.total || 0), 0),
    };
}
