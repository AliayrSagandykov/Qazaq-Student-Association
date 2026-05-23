import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaignById } from "@/lib/queries";
import CampaignDetail from "./CampaignDetail";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const c = await getCampaignById(id);
  return { title: c ? `${c.studentName} — Campaign` : "Campaign" };
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCampaignById(id);
  if (!c) notFound();
  return <CampaignDetail c={c} />;
}
