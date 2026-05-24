import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { getEvents } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover Kazakh community events across the USA on an interactive map.",
};

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
