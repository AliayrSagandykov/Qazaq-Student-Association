import LandingClient from "./LandingClient";
import { getMembers, getEvents, getCampaigns } from "@/lib/queries";

export const revalidate = 300;

export default async function Home() {
  const [members, events, campaigns] = await Promise.all([
    getMembers(),
    getEvents(),
    getCampaigns(),
  ]);

  return <LandingClient members={members} events={events} campaigns={campaigns} />;
}
