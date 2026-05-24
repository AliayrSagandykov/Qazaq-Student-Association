import type { Metadata } from "next";
import CrowdfundingClient from "./CrowdfundingClient";
import { getCampaigns } from "@/lib/queries";

// Render on each request so newly approved campaigns show up immediately.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crowdfunding",
  description: "Support Kazakh students through verified crowdfunding campaigns.",
};

export default async function CrowdfundingPage() {
  const campaigns = await getCampaigns();
  return <CrowdfundingClient campaigns={campaigns} />;
}
