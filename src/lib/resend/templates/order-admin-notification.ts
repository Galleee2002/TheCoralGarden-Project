import { formatPrice } from "@/lib/format-price";
import type { OrderEmailData } from "../types";

export function buildOrderAdminNotificationHtml(data: OrderEmailData): string {
  const shortId = data.orderId.slice(-8).toUpperCase();
  const hasTracking = Boolean(data.shippingTrackingNumber);

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
          ${formatPrice(item.unitPrice)}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; text-align: right; color: #111C24;">
          ${formatPrice(item.unitPrice * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const shippingLabel =
    data.shippingCost > 0 ? formatPrice(data.shippingCost) : "A coordinar";

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
          <tr>
            <td style="background-color: #042F34; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #74E4BB; font-size: 24px; font-weight: 800; letter-spacing: 1px;">
                NUEVA COMPRA
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #042F34; font-size: 22px; font-weight: 700;">
                Pedido #${shortId}
              </h2>
              <p style="margin: 0 0 24px; color: #6B7280; font-size: 15px;">
                Se confirmó un nuevo pago y ya podés gestionar esta compra.
              </p>

              <div style="background-color: #D6E5E9; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px; color: #042F34; font-size: 15px; font-weight: 700;">
                  Datos del cliente
                </h3>
                <p style="margin: 0; color: #111C24; font-size: 14px; line-height: 1.8;">
                  <strong>Nombre:</strong> ${data.customerName}<br />
                  <strong>Email:</strong> ${data.customerEmail}<br />
                  <strong>Teléfono:</strong> ${data.customerPhone}<br />
                  <strong>Dirección:</strong> ${data.customerStreet}<br />
                  <strong>Ciudad:</strong> ${data.customerCity}<br />
                  <strong>Provincia:</strong> ${data.customerProvince}<br />
                  <strong>Código postal:</strong> ${data.customerZip}
                </p>
              </div>

              <div style="background-color: #F8F8F8; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px; color: #042F34; font-size: 15px; font-weight: 700;">
                  Logística
                </h3>
                <p style="margin: 0; color: #111C24; font-size: 14px; line-height: 1.8;">
                  <strong>Carrier:</strong> ${data.shippingCarrier ?? "Correo Argentino"}<br />
                  <strong>Tracking:</strong> ${hasTracking ? data.shippingTrackingNumber : "Pendiente de sincronización"}
                </p>
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding-bottom: 8px; border-bottom: 2px solid #042F34; color: #042F34; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Producto
                    </th>
                    <th style="text-align: right; padding-bottom: 8px; border-bottom: 2px solid #042F34; color: #042F34; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Unitario
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

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; color: #6B7280; font-size: 14px;">Envío</td>
                  <td style="padding: 6px 0; text-align: right; color: #111C24; font-size: 14px;">
                    ${shippingLabel}
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
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
