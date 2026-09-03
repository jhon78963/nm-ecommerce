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
