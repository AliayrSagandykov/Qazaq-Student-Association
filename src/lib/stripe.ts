import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

export const isStripeConfigured = Boolean(secret);

export function getStripe(): Stripe | null {
  if (!secret) return null;
  return new Stripe(secret);
}
