import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/queries";
import EventDetailClient from "./EventDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const e = await getEventById(id);
  return { title: e ? e.title : "Event" };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = await getEventById(id);
  if (!e) notFound();
  return <EventDetailClient event={e} />;
}
