import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMemberById } from "@/lib/queries";
import MemberProfile from "./MemberProfile";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const m = await getMemberById(id);
  return { title: m ? `${m.name} — Member` : "Member" };
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await getMemberById(id);
  if (!m) notFound();
  return <MemberProfile m={m} />;
}
