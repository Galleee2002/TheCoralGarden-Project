import { NextRequest, NextResponse } from "next/server";
import { syncPendingCorreoTracking } from "@/lib/correo-argentino/order-shipping";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await syncPendingCorreoTracking();

  return NextResponse.json({
    processed: results.length,
    results,
  });
}
