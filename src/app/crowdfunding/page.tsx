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
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Student Crowdfunding</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Every campaign is reviewed by QSA moderators who verify acceptance letters and tuition data
        before publishing.
      </p>
      <div className="mt-10">
        <CrowdfundingClient campaigns={campaigns} />
      </div>
    </div>
  );
}
