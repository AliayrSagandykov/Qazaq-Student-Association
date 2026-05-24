import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getAdminClient } from "@/lib/supabase/admin";

// Stripe needs the raw request body to verify the signature.
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "no_signature" }, { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const campaignId = session.metadata?.campaign_id;
    const amount = (session.amount_total ?? 0) / 100;
    const anonymous = session.metadata?.anonymous === "1";
    const donorName = session.metadata?.donor_name || "Anonymous";

    const db = getAdminClient();
    if (db && campaignId && amount > 0) {
      // Idempotent insert: the unique stripe_session_id prevents double counting.
      const { error } = await db.from("donations").insert({
        campaign_id: campaignId,
        donor_name: anonymous ? "Anonymous" : donorName,
        amount,
        anonymous,
        stripe_session_id: session.id,
      });

      if (!error) {
        const { data: campaign } = await db
          .from("campaigns")
          .select("raised")
          .eq("id", campaignId)
          .maybeSingle();
        if (campaign) {
          await db
            .from("campaigns")
            .update({ raised: Number(campaign.raised) + amount })
            .eq("id", campaignId);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
