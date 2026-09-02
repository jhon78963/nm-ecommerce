import type { ShippingMethodOption } from "@/features/checkout/types/checkout.types";

export const TRUJILLO_SHIPPING_METHODS: ShippingMethodOption[] = [
  {
    id: "pickup-mayorista",
    title: "Recojo en tienda — Mercado Mayorista (Puesto C-74, Trujillo)",
    cost: 0,
    trujilloOnly: true,
  },
  {
    id: "pickup-acomar",
    title: "Recojo en tienda — Mercado Acomar (Puesto 70, Manuel Arévalo)",
    cost: 0,
    trujilloOnly: true,
  },
  {
    id: "delivery-trujillo",
    title: "Delivery local Trujillo (motorizado)",
    cost: 8,
    trujilloOnly: true,
  },
];

export const NATIONAL_SHIPPING_METHODS: ShippingMethodOption[] = [
  {
    id: "olva",
    title: "Envío por agencia Olva",
    cost: 15,
  },
  {
    id: "shalom",
    title: "Envío por agencia Shalom",
    cost: 12,
  },
];

/** Provincias de La Libertad fuera de Trujillo (código postal distinto de 130*). */
export const LA_LIBERTAD_SHIPPING_METHODS: ShippingMethodOption[] = [
  ...NATIONAL_SHIPPING_METHODS,
  {
    id: "libertad-provincias",
    title: "Envío por agencia — provincias de La Libertad (fuera de Trujillo)",
    cost: 10,
  },
];
