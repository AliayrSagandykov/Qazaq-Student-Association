import { getSupabase } from "./supabase";
import {
  members as mockMembers,
  events as mockEvents,
  campaigns as mockCampaigns,
  newsPosts as mockNews,
  type Member,
  type PlatformEvent,
  type Campaign,
  type DonationEntry,
  type NewsPost,
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
    userId: r.user_id ? String(r.user_id) : undefined,
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
    about: r.about ? String(r.about) : undefined,
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
    ownerId: r.owner_id ? String(r.owner_id) : undefined,
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

export async function getMemberById(id: string): Promise<Member | undefined> {
  const db = getSupabase();
  if (!db) return mockMembers.find((m) => m.id === id);
  const { data, error } = await db.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error || !data) return undefined;
  return mapMember(data);
}

export async function getEvents(): Promise<PlatformEvent[]> {
  const db = getSupabase();
  if (!db) return mockEvents;
  const { data, error } = await db.from("events").select("*").order("date");
  if (error || !data) return mockEvents;
  return data.map(mapEvent);
}

export async function getEventById(id: string): Promise<PlatformEvent | undefined> {
  const db = getSupabase();
  if (!db) return mockEvents.find((e) => e.id === id);
  const { data, error } = await db.from("events").select("*").eq("id", id).maybeSingle();
  if (error || !data) return undefined;
  return mapEvent(data);
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
  const campaigns = data.map(mapCampaign);

  // Attach each owner's profile photo for the campaign cards.
  const ownerIds = data.map((r) => r.owner_id).filter(Boolean) as string[];
  if (ownerIds.length) {
    const { data: profs } = await db
      .from("profiles")
      .select("user_id, avatar_url")
      .in("user_id", ownerIds);
    const avatars = new Map((profs ?? []).map((p) => [p.user_id, p.avatar_url]));
    campaigns.forEach((c, i) => {
      const url = avatars.get(data[i].owner_id);
      if (url) c.avatarUrl = String(url);
    });
  }
  return campaigns;
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
  const campaign = mapCampaign(data);
  if (data.owner_id) {
    const { data: prof } = await db
      .from("profiles")
      .select("avatar_url")
      .eq("user_id", data.owner_id)
      .maybeSingle();
    if (prof?.avatar_url) campaign.avatarUrl = String(prof.avatar_url);
  }
  return campaign;
}

function mapNews(r: Row): NewsPost {
  return {
    id: String(r.id),
    title: str(r.title),
    excerpt: str(r.excerpt),
    body: str(r.body),
    coverUrl: r.cover_url ? String(r.cover_url) : undefined,
    category: r.category as NewsPost["category"],
    date: String(r.created_at ?? r.date),
  };
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  const db = getSupabase();
  if (!db) return mockNews;
  const { data, error } = await db
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error || !data) return mockNews;
  return data.map(mapNews);
}

export async function getNewsPostById(id: string): Promise<NewsPost | undefined> {
  const db = getSupabase();
  if (!db) return mockNews.find((n) => n.id === id);
  const { data, error } = await db.from("news_posts").select("*").eq("id", id).maybeSingle();
  if (error || !data) return undefined;
  return mapNews(data);
}
