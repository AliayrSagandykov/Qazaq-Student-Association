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
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl font-bold sm:text-4xl">Community Directory</h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        Discover students and alumni across the network. Filter by university, major, state,
        industry, graduation year, and degree.
      </p>
      <div className="mt-10">
        <DirectoryClient members={members} />
      </div>
    </div>
  );
}
