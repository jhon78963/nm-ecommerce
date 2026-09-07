const STORAGE_KEY = "nm.culqi-pending-charge";
const IN_FLIGHT_KEY = "nm.culqi-charge-in-flight";

export interface CulqiPendingCharge {
  orderNumber: string;
  email: string;
  culqiToken: string;
}

function normalizeChargeKey(orderNumber: string, email: string): string {
  return `${orderNumber.trim()}:${email.trim().toLowerCase()}`;
}

function readAllPendingCharges(): CulqiPendingCharge[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CulqiPendingCharge | CulqiPendingCharge[];
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}

function writePendingCharges(charges: CulqiPendingCharge[]) {
  if (typeof window === "undefined") {
    return;
  }

  if (charges.length === 0) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(charges));
}

export function storeCulqiPendingCharge(charge: CulqiPendingCharge): void {
  const normalizedEmail = charge.email.trim().toLowerCase();
  const nextCharge = {
    orderNumber: charge.orderNumber.trim(),
    email: normalizedEmail,
    culqiToken: charge.culqiToken,
  };

  const remaining = readAllPendingCharges().filter(
    (item) =>
      item.orderNumber !== nextCharge.orderNumber
      || item.email.trim().toLowerCase() !== normalizedEmail,
  );

  writePendingCharges([...remaining, nextCharge]);
}

export function getCulqiPendingCharge(
  orderNumber: string,
  email: string,
): CulqiPendingCharge | null {
  const normalizedNumber = orderNumber.trim();
  const normalizedEmail = email.trim().toLowerCase();

  return (
    readAllPendingCharges().find(
      (item) =>
        item.orderNumber === normalizedNumber
        && item.email.trim().toLowerCase() === normalizedEmail,
    ) ?? null
  );
}

export function clearCulqiPendingCharge(orderNumber: string, email: string): void {
  const normalizedNumber = orderNumber.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const remaining = readAllPendingCharges().filter(
    (item) =>
      item.orderNumber !== normalizedNumber
      || item.email.trim().toLowerCase() !== normalizedEmail,
  );

  writePendingCharges(remaining);
  clearCulqiChargeInFlight(orderNumber, email);
}

export function isCulqiChargeInFlight(orderNumber: string, email: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(IN_FLIGHT_KEY) === normalizeChargeKey(orderNumber, email);
}

export function tryAcquireCulqiChargeLock(orderNumber: string, email: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const key = normalizeChargeKey(orderNumber, email);
  if (sessionStorage.getItem(IN_FLIGHT_KEY) === key) {
    return false;
  }

  sessionStorage.setItem(IN_FLIGHT_KEY, key);
  return true;
}

export function clearCulqiChargeInFlight(orderNumber: string, email: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const key = normalizeChargeKey(orderNumber, email);
  if (sessionStorage.getItem(IN_FLIGHT_KEY) === key) {
    sessionStorage.removeItem(IN_FLIGHT_KEY);
  }
}
