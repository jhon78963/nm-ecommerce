export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  paymentMethodTitle: string;
  total: number;
  createdAt: string;
}

export interface CustomerOrdersResponse {
  orders: CustomerOrderSummary[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface CustomerAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  country: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  postcode: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddressInput {
  label?: string;
  firstName: string;
  lastName: string;
  country: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CustomerNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface CustomerNotificationSettings {
  id: string;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export interface CustomerRefund {
  id: string;
  status: string;
  reason: string;
  amount: string | number | null;
  createdAt: string;
  order: {
    orderNumber: string;
    total: string | number;
    status: string;
    paymentStatus: string;
  };
}
