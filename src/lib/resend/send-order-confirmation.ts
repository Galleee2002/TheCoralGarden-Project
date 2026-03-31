import { resend } from "./client";
import { buildOrderConfirmationHtml } from "./templates/order-confirmation";

type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
};

type OrderEmailData = {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingCost: number;
  total: number;
  orderId: string;
};

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const html = buildOrderConfirmationHtml(data);

  const { error } = await resend.emails.send({
    from: "The Coral Garden <no-reply@thecoralgarden.com>",
    to: data.customerEmail,
    subject: `Confirmación de compra - Pedido #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });

  if (error) {
    console.error("[Resend Error]", error);
  }
}
