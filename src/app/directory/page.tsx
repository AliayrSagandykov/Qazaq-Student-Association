import type { Metadata } from "next";
import DirectoryClient from "./DirectoryClient";
import { getMembers } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Community Directory",
  description: "Search and filter Kazakh students and alumni by university, major, state, and more.",
};

export default async function DirectoryPage() {
  const members = await getMembers();
  return <DirectoryClient members={members} />;
}
