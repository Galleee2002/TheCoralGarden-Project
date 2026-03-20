import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";

function verifyMPSignature(
  request: NextRequest,
  dataId: string | undefined,
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
    Buffer.from(v1, "utf8"),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: string;
      action?: string;
      data?: { id?: string };
    };

    if (!verifyMPSignature(request, body.data?.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.type !== "payment" && body.action !== "payment.updated") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
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

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        mpPaymentId: String(paymentId),
      },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
