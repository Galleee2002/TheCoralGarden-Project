import { ORDER_ADMIN_EMAIL, ORDER_EMAIL_FROM } from "./config";
import { resend } from "./client";
import { buildOrderAdminNotificationHtml } from "./templates/order-admin-notification";
import type { OrderEmailData } from "./types";

export async function sendOrderAdminNotificationEmail(data: OrderEmailData) {
  const html = buildOrderAdminNotificationHtml(data);

  const { error } = await resend.emails.send({
    from: ORDER_EMAIL_FROM,
    to: ORDER_ADMIN_EMAIL,
    replyTo: data.customerEmail,
    subject: `Nueva compra recibida - Pedido #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });

  if (error) {
    console.error("[Resend Admin Error]", error);
  }
}
