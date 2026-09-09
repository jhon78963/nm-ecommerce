export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_variant?: string;
};

export type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export {};
