export function formatYapePhoneForDisplay(phoneDigits: string): string {
  const digits = phoneDigits.replace(/\D/g, "");
  const local = digits.startsWith("51") && digits.length >= 11 ? digits.slice(2) : digits;

  if (local.length !== 9) {
    return phoneDigits;
  }

  return `+51 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

export function formatYapePhoneForCopy(phoneDigits: string): string {
  const digits = phoneDigits.replace(/\D/g, "");
  if (digits.startsWith("51") && digits.length >= 11) {
    return digits.slice(2);
  }

  return digits;
}
