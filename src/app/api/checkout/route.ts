import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const campaignId: string | undefined = body?.campaignId;
  const amount = Number(body?.amount);
  const recurring = Boolean(body?.recurring);
  const anonymous = Boolean(body?.anonymous);
  const donorName = typeof body?.donorName === "string" ? body.donorName.slice(0, 80) : "";

  if (!campaignId || !Number.isFinite(amount) || amount < 1) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Confirm the campaign exists and is approved before taking money for it.
  const db = getSupabase();
  let campaignName = "a student";
  if (db) {
    const { data } = await db
      .from("campaigns")
      .select("student_name, status")
      .eq("id", campaignId)
      .maybeSingle();
    if (!data || data.status !== "approved") {
      return NextResponse.json({ error: "campaign_unavailable" }, { status: 404 });
    }
    campaignName = data.student_name;
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    new URL(request.url).origin;
  const cents = Math.round(amount * 100);

  const session = await stripe.checkout.sessions.create({
    mode: recurring ? "subscription" : "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: cents,
          product_data: { name: `Donation to ${campaignName}` },
          ...(recurring ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    success_url: `${origin}/crowdfunding/${campaignId}?donated=1`,
    cancel_url: `${origin}/crowdfunding/${campaignId}`,
    metadata: {
      campaign_id: campaignId,
      anonymous: anonymous ? "1" : "0",
      donor_name: anonymous ? "" : donorName,
    },
  });

  return NextResponse.json({ url: session.url });
}
