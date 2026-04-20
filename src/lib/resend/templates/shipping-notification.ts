import type { OrderEmailData } from "../types";

export function buildShippingNotificationHtml(data: OrderEmailData): string {
  const shortId = data.orderId.slice(-8).toUpperCase();
  const tracking = data.shippingTrackingNumber ?? "Pendiente";

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
                TU PEDIDO FUE DESPACHADO
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #042F34; font-size: 22px; font-weight: 700;">
                Pedido #${shortId}
              </h2>
              <p style="margin: 0 0 24px; color: #6B7280; font-size: 15px; line-height: 1.6;">
                Hola ${data.customerName}, tu compra ya fue registrada para envio por ${data.shippingCarrier ?? "Correo Argentino"}.
              </p>

              <div style="background-color: #D6E5E9; border-radius: 10px; padding: 20px;">
                <h3 style="margin: 0 0 8px; color: #042F34; font-size: 15px; font-weight: 700;">
                  Seguimiento
                </h3>
                <p style="margin: 0; color: #111C24; font-size: 14px; line-height: 1.6;">
                  Numero de tracking: <strong>${tracking}</strong><br />
                  Metodo: ${data.shippingProductName ?? "Correo Argentino"}<br />
                  Tipo de entrega: ${data.shippingDeliveryLabel ?? "Correo Argentino"}
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #042F34; padding: 24px 40px; text-align: center;">
              <p style="margin: 0; color: #74E4BB; font-size: 13px;">
                The Coral Garden
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
