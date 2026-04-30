import { ORDER_ADMIN_EMAIL, ORDER_EMAIL_FROM } from "./config";
import { resend } from "./client";
import { buildShippingNotificationHtml } from "./templates/shipping-notification";
import type { OrderEmailData } from "./types";

export async function sendShippingNotificationEmail(data: OrderEmailData) {
  const html = buildShippingNotificationHtml(data);

  const { data: result, error } = await resend.emails.send({
    from: ORDER_EMAIL_FROM,
    to: data.customerEmail,
    replyTo: ORDER_ADMIN_EMAIL,
    subject: `Seguimiento de tu pedido #${data.orderId.slice(-8).toUpperCase()}`,
    html,
  });

  if (error) {
    console.error("[Resend Shipping Error]", error);
    throw new Error(error.message);
  }

  return result;
}
