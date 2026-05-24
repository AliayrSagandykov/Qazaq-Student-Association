import type { Metadata } from "next";
import DirectoryClient from "./DirectoryClient";
import { getMembers } from "@/lib/queries";

// Cached for fast loads, refreshed in the background every 30s.
export const revalidate = 30;

export const metadata: Metadata = {
  title: "Community Directory",
  description: "Search and filter Kazakh students and alumni by university, major, state, and more.",
};

export default async function DirectoryPage() {
  const members = await getMembers();
  return <DirectoryClient members={members} />;
}
