export interface WhatsAppPendingCartLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPriceLabel: string;
  sizeLabel?: string | null;
  colorLabel?: string | null;
  sku?: string | null;
  productUrl?: string | null;
}
