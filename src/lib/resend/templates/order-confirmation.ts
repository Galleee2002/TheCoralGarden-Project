import { formatPrice } from "@/lib/format-price";
import { ORDER_ADMIN_EMAIL } from "../config";
import type { OrderEmailData } from "../types";

export function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const shortId = data.orderId.slice(-8).toUpperCase();
  const supportEmail = ORDER_ADMIN_EMAIL;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB;">
          <strong style="color: #111C24;">${item.productName}</strong>
          <br />
          <span style="color: #6B7280; font-size: 14px;">Cantidad: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; text-align: right; color: #111C24;">
          ${formatPrice(item.unitPrice * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #F8F8F8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F8F8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 15px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: #042F34; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #74E4BB; font-size: 24px; font-weight: 800; letter-spacing: 1px;">
                THE CORAL GARDEN
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #042F34; font-size: 22px; font-weight: 700;">
                ¡Gracias por tu compra, ${data.customerName}!
              </h2>
              <p style="margin: 0 0 24px; color: #6B7280; font-size: 15px;">
                Tu pago fue confirmado. Acá tenés el detalle de tu pedido <strong>#${shortId}</strong>.
              </p>

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px; border-bottom: 2px solid #042F34; color: #042F34; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Producto
                    </th>
                    <th style="text-align: right; padding-bottom: 8px; border-bottom: 2px solid #042F34; color: #042F34; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Envío</td>
                  <td style="padding: 6px 0; text-align: right; color: #111C24; font-size: 14px;">
                    ${data.shippingCost > 0 ? formatPrice(data.shippingCost) : "A coordinar"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0; color: #042F34; font-size: 18px; font-weight: 700; border-top: 2px solid #042F34;">
                    Total
                  </td>
                  <td style="padding: 12px 0 0; text-align: right; color: #042F34; font-size: 18px; font-weight: 700; border-top: 2px solid #042F34;">
                    ${formatPrice(data.total)}
                  </td>
                </tr>
              </table>

              <!-- Shipping Info -->
              <div style="background-color: #D6E5E9; border-radius: 10px; padding: 20px; margin-bottom: 32px;">
                <h3 style="margin: 0 0 8px; color: #042F34; font-size: 15px; font-weight: 700;">
                  Método de envío
                </h3>
                <p style="margin: 0; color: #111C24; font-size: 14px; line-height: 1.5;">
                  Nos vamos a comunicar con vos para coordinar el envío de tu pedido.
                  Te contactaremos por WhatsApp o email con los detalles.
                </p>
              </div>

              <!-- Contact -->
              <div style="background-color: #F8F8F8; border-radius: 10px; padding: 20px;">
                <h3 style="margin: 0 0 8px; color: #042F34; font-size: 15px; font-weight: 700;">
                  ¿Tenés alguna duda?
                </h3>
                <p style="margin: 0; color: #111C24; font-size: 14px; line-height: 1.6;">
                  Escribinos por WhatsApp al
                  <a href="https://wa.me/5491136647107" style="color: #33C2E9; text-decoration: none; font-weight: 600;">
                    +54 9 11 3664-7107
                  </a>
                  <br />
                  o envianos un mail a
                  <a href="mailto:${supportEmail}" style="color: #33C2E9; text-decoration: none; font-weight: 600;">
                    ${supportEmail}
                  </a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #042F34; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #74E4BB; font-size: 13px;">
                The Coral Garden &mdash; Acuarismo &amp; Purificación
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
