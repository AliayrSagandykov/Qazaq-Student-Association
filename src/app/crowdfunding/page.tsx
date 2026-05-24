import type { Metadata } from "next";
import CrowdfundingClient from "./CrowdfundingClient";
import { getCampaigns } from "@/lib/queries";

// Cached for fast loads, refreshed in the background every 30s.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Crowdfunding",
  description: "Support Kazakh students through verified crowdfunding campaigns.",
};

export default async function CrowdfundingPage() {
  const campaigns = await getCampaigns();
  return <CrowdfundingClient campaigns={campaigns} />;
}
