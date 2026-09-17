// Logique de résolution du paiement partagée entre les mutations de
// commande normale et invité, pour éviter que les deux divergent.

const SUCCESS_KEYWORDS = ["SUCCESS", "PAID", "COMPLETED", "CONFIRMED", "APPROVED"];
const FAILURE_KEYWORDS = ["FAILED", "CANCELLED", "CANCELED", "DECLINED", "REJECTED", "NOT_FOUND"];

export type OrderOutcome = "SUCCESS" | "FAILED" | "PENDING";

export interface ResolvedOrderOutcome {
  outcome: OrderOutcome;
  vendorReference: string | null;
}

function findFirstValueByKeys(
  payload: unknown,
  candidateKeys: string[]
): string | null {
  if (!payload || typeof payload !== "object") return null;

  const normalized = new Set(candidateKeys.map((k) => k.toLowerCase()));
  const queue: unknown[] = [payload];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || typeof current !== "object" || visited.has(current)) {
      continue;
    }
    visited.add(current);

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item);
      continue;
    }

    for (const [key, value] of Object.entries(
      current as Record<string, unknown>
    )) {
      if (normalized.has(key.toLowerCase())) {
        if (typeof value === "string" && value.trim()) {
          return value;
        }
        if (typeof value === "number" && Number.isFinite(value)) {
          return String(value);
        }
      }

      if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }

  return null;
}

export function extractVendorReference(payload: any): string | null {
  const extractedRef =
    payload?.vendor_reference ??
    payload?.ref ??
    payload?.reference ??
    payload?.payment?.vendor_reference ??
    payload?.payment?.ref ??
    payload?.payment?.reference ??
    payload?.vendorReference ??
    payload?.transaction_ref ??
    payload?.transactionRef ??
    payload?.data?.vendor_reference ??
    payload?.data?.ref ??
    payload?.data?.reference ??
    payload?.data?.payment?.vendor_reference ??
    payload?.data?.payment?.ref ??
    payload?.data?.payment?.reference ??
    payload?.data?.vendorReference ??
    payload?.data?.transaction_ref ??
    payload?.data?.transactionRef ??
    payload?.data?.[0]?.vendor_reference ??
    payload?.data?.[0]?.ref ??
    payload?.data?.[0]?.reference ??
    payload?.data?.[0]?.payment?.vendor_reference ??
    payload?.data?.[0]?.payment?.ref ??
    payload?.data?.[0]?.payment?.reference ??
    payload?.data?.[0]?.vendorReference ??
    payload?.data?.[0]?.transaction_ref ??
    payload?.data?.[0]?.transactionRef ??
    findFirstValueByKeys(payload, [
      "vendor_reference",
      "vendorReference",
      "transaction_ref",
      "transactionRef",
      "payment_reference",
      "paymentReference",
      "ref",
      "reference",
    ]);

  const normalizedRef =
    extractedRef === null || extractedRef === undefined
      ? null
      : String(extractedRef).trim() || null;

  return normalizedRef;
}

export function extractPaymentStatus(payload: any): OrderOutcome | null {
  const rawStatus =
    payload?.order?.status ??
    payload?.payment?.status ??
    payload?.status ??
    payload?.payment_status ??
    payload?.paymentStatus ??
    payload?.transaction_status ??
    payload?.transactionStatus ??
    payload?.data?.order?.status ??
    payload?.data?.payment?.status ??
    payload?.data?.status ??
    payload?.data?.payment_status ??
    payload?.data?.paymentStatus ??
    payload?.data?.transaction_status ??
    payload?.data?.transactionStatus ??
    payload?.data?.[0]?.status ??
    payload?.data?.[0]?.payment_status ??
    payload?.data?.[0]?.paymentStatus ??
    payload?.data?.[0]?.transaction_status ??
    payload?.data?.[0]?.transactionStatus ??
    findFirstValueByKeys(payload, [
      "status",
      "payment_status",
      "paymentStatus",
      "transaction_status",
      "transactionStatus",
    ]);
  if (!rawStatus) return null;

  const normalizedStatus = String(rawStatus).toUpperCase();
  if (SUCCESS_KEYWORDS.some((keyword) => normalizedStatus.includes(keyword))) {
    return "SUCCESS";
  }
  if (FAILURE_KEYWORDS.some((keyword) => normalizedStatus.includes(keyword))) {
    return "FAILED";
  }
  return "PENDING";
}

/**
 * Décide de l'issue d'une création de commande. Certains paiements se
 * résolvent de façon synchrone (ex. order.status "PAID") sans référence de
 * transaction à suivre : on vérifie d'abord ce statut avant de retomber sur
 * le polling par référence, sinon on traiterait à tort l'absence de
 * référence comme un échec.
 */
export function resolveOrderCreationOutcome(payload: any): ResolvedOrderOutcome {
  const status = extractPaymentStatus(payload);
  if (status === "SUCCESS" || status === "FAILED") {
    return { outcome: status, vendorReference: extractVendorReference(payload) };
  }

  const vendorReference = extractVendorReference(payload);
  if (!vendorReference) {
    return { outcome: "FAILED", vendorReference: null };
  }
  return { outcome: "PENDING", vendorReference };
}
