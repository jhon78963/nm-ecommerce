export interface PeruDepartment {
  code: string;
  name: string;
}

export const PERU_DEPARTMENTS: PeruDepartment[] = [
  { code: "AMA", name: "Amazonas" },
  { code: "ANC", name: "Áncash" },
  { code: "APU", name: "Apurímac" },
  { code: "ARE", name: "Arequipa" },
  { code: "AYA", name: "Ayacucho" },
  { code: "CAJ", name: "Cajamarca" },
  { code: "CUS", name: "Cusco" },
  { code: "HUV", name: "Huancavelica" },
  { code: "HUC", name: "Huánuco" },
  { code: "ICA", name: "Ica" },
  { code: "JUN", name: "Junín" },
  { code: "LAL", name: "La Libertad" },
  { code: "LAM", name: "Lambayeque" },
  { code: "LIM", name: "Lima" },
  { code: "LOR", name: "Loreto" },
  { code: "MDD", name: "Madre de Dios" },
  { code: "MOQ", name: "Moquegua" },
  { code: "PAS", name: "Pasco" },
  { code: "PIU", name: "Piura" },
  { code: "PUN", name: "Puno" },
  { code: "SAM", name: "San Martín" },
  { code: "TAC", name: "Tacna" },
  { code: "TUM", name: "Tumbes" },
  { code: "UCA", name: "Ucayali" },
  { code: "CAL", name: "Callao" },
];

export function getDepartmentName(code: string): string {
  return PERU_DEPARTMENTS.find((dept) => dept.code === code)?.name ?? code;
}

/** Códigos postales de Trujillo y distritos (13001, 13002, etc.) — igual que WooCommerce zona 130*. */
export function isTrujilloPostcode(postcode: string): boolean {
  return postcode.trim().startsWith("130");
}

export function isTrujilloZone(postcode: string, _state?: string): boolean {
  return isTrujilloPostcode(postcode);
}

export type ShippingZone = "trujillo" | "la-libertad" | "national";

/**
 * Determina la zona de envío según código postal y departamento.
 * - 130*: Trujillo y distritos aledaños
 * - La Libertad con otro código: provincias fuera de Trujillo
 * - Otros departamentos: envío nacional
 */
export function resolveShippingZone(postcode: string, state: string): ShippingZone {
  const normalizedPostcode = postcode.trim();

  if (isTrujilloPostcode(normalizedPostcode)) {
    return "trujillo";
  }

  if (normalizedPostcode.length > 0 && state === "LAL") {
    return "la-libertad";
  }

  return "national";
}
