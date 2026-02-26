import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { MercadoPagoConfig, Payment } from "mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type?: string;
      action?: string;
      data?: { id?: string };
    };

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
