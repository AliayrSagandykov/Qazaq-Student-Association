import type { Metadata } from "next";
import EventsClient from "./EventsClient";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover Kazakh community events across the USA on an interactive map.",
};

export default function EventsPage() {
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Events</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        A map-first view of meetups, conferences, Nauryz gatherings, and startup events across the
        United States.
      </p>
      <div className="mt-10">
        <EventsClient />
      </div>
    </div>
  );
}
