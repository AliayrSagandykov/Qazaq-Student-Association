import type { Metadata } from "next";
import CrowdfundingClient from "./CrowdfundingClient";
import { getCampaigns } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Crowdfunding",
  description: "Support Kazakh students through verified crowdfunding campaigns.",
};

export default async function CrowdfundingPage() {
  const campaigns = await getCampaigns();
  return <CrowdfundingClient campaigns={campaigns} />;
}
