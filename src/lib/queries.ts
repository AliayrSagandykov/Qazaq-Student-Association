import { getSupabase } from "./supabase";
import {
  members as mockMembers,
  events as mockEvents,
  campaigns as mockCampaigns,
  type Member,
  type PlatformEvent,
  type Campaign,
  type DonationEntry,
} from "./data";

// Data access layer. Reads from Supabase when configured, otherwise serves
// the mock data so the site works before a database is connected.

type Row = Record<string, unknown>;

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function mapMember(r: Row): Member {
  return {
    id: String(r.id),
    name: str(r.name),
    university: str(r.university),
    major: str(r.major),
    degree: (r.degree as Member["degree"]) ?? "Bachelor's",
    gradYear: r.grad_year == null ? 0 : Number(r.grad_year),
    state: str(r.state),
    city: str(r.city),
    industry: str(r.industry),
    isAlumni: Boolean(r.is_alumni),
    bio: str(r.bio),
    initials: str(r.initials),
    avatarUrl: r.avatar_url ? String(r.avatar_url) : undefined,
    linkedin: r.linkedin ? String(r.linkedin) : undefined,
    website: r.website ? String(r.website) : undefined,
    publicEmail: r.public_email ? String(r.public_email) : undefined,
  };
}

function mapEvent(r: Row): PlatformEvent {
  return {
    id: String(r.id),
    title: String(r.title),
    description: String(r.description),
    organizer: String(r.organizer),
    date: String(r.date),
    city: String(r.city),
    state: String(r.state),
    venue: String(r.venue),
    lat: Number(r.lat),
    lng: Number(r.lng),
    attendees: Number(r.attendees),
    category: r.category as PlatformEvent["category"],
  };
}

function mapCampaign(r: Row): Campaign {
  const donorsRows = (r.donations as Row[] | undefined) ?? [];
  const updateRows = (r.campaign_updates as Row[] | undefined) ?? [];
  const donors: DonationEntry[] = donorsRows.map((d) => ({
    donor: String(d.donor_name),
    amount: Number(d.amount),
    anonymous: Boolean(d.anonymous),
  }));
  return {
    id: String(r.id),
    studentName: String(r.student_name),
    initials: String(r.initials),
    university: String(r.university),
    major: String(r.major),
    degree: r.degree as Campaign["degree"],
    state: String(r.state),
    shortBio: String(r.short_bio),
    story: String(r.story),
    goals: (r.goals as string[] | null) ?? [],
    target: Number(r.target),
    raised: Number(r.raised),
    urgency: r.urgency as Campaign["urgency"],
    verified: Boolean(r.verified),
    donors,
    updates: updateRows.map((u) => ({ date: String(u.date), text: String(u.text) })),
  };
}

export async function getMembers(): Promise<Member[]> {
  const db = getSupabase();
  if (!db) return mockMembers;
  // Only list profiles that have been filled in enough to be useful.
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .not("university", "is", null)
    .neq("university", "")
    .order("name");
  if (error || !data) return mockMembers;
  return data.map(mapMember);
}

export async function getEvents(): Promise<PlatformEvent[]> {
  const db = getSupabase();
  if (!db) return mockEvents;
  const { data, error } = await db.from("events").select("*").order("date");
  if (error || !data) return mockEvents;
  return data.map(mapEvent);
}

export async function getCampaigns(): Promise<Campaign[]> {
  const db = getSupabase();
  if (!db) return mockCampaigns;
  const { data, error } = await db
    .from("campaigns")
    .select("*")
    .eq("status", "approved")
    .order("created_at");
  if (error || !data) return mockCampaigns;
  return data.map(mapCampaign);
}

export async function getCampaignById(id: string): Promise<Campaign | undefined> {
  const db = getSupabase();
  if (!db) return mockCampaigns.find((c) => c.id === id);
  const { data, error } = await db
    .from("campaigns")
    .select("*, donations(*), campaign_updates(*)")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return undefined;
  return mapCampaign(data);
}
