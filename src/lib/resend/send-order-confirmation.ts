import { ORDER_ADMIN_EMAIL, ORDER_EMAIL_FROM } from "./config";
import { resend } from "./client";
import { buildOrderConfirmationHtml } from "./templates/order-confirmation";
import type { OrderEmailData } from "./types";

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const html = buildOrderConfirmationHtml(data);

  const { error } = await resend.emails.send({
    from: ORDER_EMAIL_FROM,
    to: data.customerEmail,
    replyTo: ORDER_ADMIN_EMAIL,
    subject: `Confirmación de compra - Pedido #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });

  if (error) {
    console.error("[Resend Error]", error);
  }
}
