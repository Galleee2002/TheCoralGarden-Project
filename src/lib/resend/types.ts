export type OrderEmailItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderEmailData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerStreet: string;
  customerCity: string;
  customerProvince: string;
  customerZip: string;
  items: OrderEmailItem[];
  shippingCost: number;
  total: number;
  orderId: string;
  shippingCarrier?: string | null;
  shippingProductName?: string | null;
  shippingDeliveryLabel?: string | null;
  shippingTrackingNumber?: string | null;
};
