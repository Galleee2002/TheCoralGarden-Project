import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";
import { sendOrderAdminNotificationEmail } from "@/lib/resend/send-order-admin-notification";
import { sendOrderConfirmationEmail } from "@/lib/resend/send-order-confirmation";
import {
  buildOrderEmailData,
  importShipmentForOrder,
} from "@/lib/correo-argentino/order-shipping";
import { isCorreoArgentinoConfigured } from "@/lib/correo-argentino/client";

type MercadoPagoWebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string };
};

type PaidOrderWithItems = Parameters<typeof buildOrderEmailData>[0] & {
  orderConfirmationEmailSentAt: Date | null;
  orderAdminEmailSentAt: Date | null;
};

async function sendPendingPaidOrderEmails(order: PaidOrderWithItems) {
  const orderEmailData = buildOrderEmailData(order);
  const failures: Error[] = [];

  if (!order.orderConfirmationEmailSentAt) {
    try {
      await sendOrderConfirmationEmail(orderEmailData);
      await prisma.order.update({
        where: { id: order.id },
        data: { orderConfirmationEmailSentAt: new Date() },
      });
    } catch (error) {
      failures.push(
        error instanceof Error ? error : new Error("Order email failed")
      );
    }
  }

  if (!order.orderAdminEmailSentAt) {
    try {
      await sendOrderAdminNotificationEmail(orderEmailData);
      await prisma.order.update({
        where: { id: order.id },
        data: { orderAdminEmailSentAt: new Date() },
      });
    } catch (error) {
      failures.push(
        error instanceof Error ? error : new Error("Admin email failed")
      );
    }
  }

  if (failures.length > 0) {
    throw new AggregateError(failures, "One or more order emails failed");
  }
}

function getWebhookResourceId(
  request: NextRequest,
  body: MercadoPagoWebhookBody
): string | undefined {
  return (
    request.nextUrl.searchParams.get("data.id") ??
    request.nextUrl.searchParams.get("id") ??
    body.data?.id
  );
}

function verifyMPSignature(
  request: NextRequest,
  dataId: string | undefined
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return false;

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");
  if (!xSignature || !xRequestId) return false;

  // Parse "ts=<timestamp>,v1=<hash>"
  let ts: string | undefined;
  let v1: string | undefined;
  for (const part of xSignature.split(",")) {
    const [key, val] = part.split("=");
    if (key === "ts") ts = val;
    if (key === "v1") v1 = val;
  }
  if (!ts || !v1) return false;

  const manifest = `id:${dataId ?? ""};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const computed = hmac.digest("hex");

  // Constant-time comparison to prevent timing attacks
  if (computed.length !== v1.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(computed, "utf8"),
    Buffer.from(v1, "utf8")
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MercadoPagoWebhookBody;
    const paymentId = getWebhookResourceId(request, body);

    if (!verifyMPSignature(request, paymentId)) {
      console.error("[MP Webhook Error] Invalid signature", {
        url: request.url,
        body,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.type !== "payment" && body.action !== "payment.updated") {
      return NextResponse.json({ received: true });
    }

    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const mpStatus = payment.status;

    type OrderStatusType =
      | "PENDING"
      | "PAID"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED";

    const statusMap: Record<string, OrderStatusType> = {
      approved: "PAID",
      rejected: "CANCELLED",
      cancelled: "CANCELLED",
      pending: "PENDING",
      in_process: "PENDING",
    };

    const newStatus = statusMap[mpStatus ?? ""] ?? "PENDING";

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ received: true });
    }

    const normalizedPaymentId = String(paymentId);
    const alreadyProcessedSamePayment =
      existingOrder.mpPaymentId === normalizedPaymentId &&
      existingOrder.status === newStatus;

    if (alreadyProcessedSamePayment) {
      if (newStatus === "PAID") {
        await sendPendingPaidOrderEmails(existingOrder);
      }

      return NextResponse.json({ received: true });
    }

    if (
      newStatus === "PAID" &&
      existingOrder.status === "PAID" &&
      existingOrder.mpPaymentId &&
      existingOrder.mpPaymentId !== normalizedPaymentId
    ) {
      console.warn("[MP Webhook Warning] Ignoring conflicting payment id", {
        orderId,
        storedPaymentId: existingOrder.mpPaymentId,
        incomingPaymentId: normalizedPaymentId,
      });

      return NextResponse.json({ received: true });
    }

    if (newStatus === "PAID" && existingOrder.status !== "PAID") {
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          const updatedProducts = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: {
                gte: item.quantity,
              },
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          if (updatedProducts.count === 0) {
            throw new Error(`Stock insuficiente para ${item.productName}`);
          }
        }

        await tx.order.update({
          where: { id: orderId },
          data: {
            status: newStatus,
            mpPaymentId: normalizedPaymentId,
          },
        });
      });
    } else {
      if (
        newStatus === "PAID" &&
        existingOrder.status === "PAID" &&
        !existingOrder.mpPaymentId
      ) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            mpPaymentId: normalizedPaymentId,
          },
        });

        return NextResponse.json({ received: true });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          mpPaymentId: normalizedPaymentId,
        },
      });
    }

    let updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!updatedOrder) {
      return NextResponse.json({ received: true });
    }

    if (newStatus === "PAID" && existingOrder.status !== "PAID") {
      if (await isCorreoArgentinoConfigured()) {
        await importShipmentForOrder(updatedOrder);
      }

      updatedOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!updatedOrder) {
        return NextResponse.json({ received: true });
      }

      await sendPendingPaidOrderEmails(updatedOrder);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
