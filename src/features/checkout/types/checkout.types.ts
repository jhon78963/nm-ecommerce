export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
}

export interface CheckoutFormData {
  billing: CheckoutAddress;
  shipping: CheckoutAddress;
  email: string;
  orderNotes: string;
  shippingMethodId: string;
  paymentMethodId: string;
  couponCode: string;
}

export interface ShippingMethodOption {
  id: string;
  title: string;
  cost: number;
  trujilloOnly?: boolean;
}

export interface PaymentMethodOption {
  id: string;
  title: string;
  description: string;
  trujilloOnly?: boolean;
}

export interface CheckoutTotals {
  subtotal: number;
  shippingTotal: number;
  couponDiscount: number;
  total: number;
}
