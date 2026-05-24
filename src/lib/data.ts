// Mock data layer for the QSA platform MVP.
// In production this is replaced by Supabase / API queries.

export type DegreeLevel = "Bachelor's" | "Master's" | "PhD";

export interface Member {
  id: string;
  userId?: string;
  name: string;
  university: string;
  major: string;
  degree: DegreeLevel;
  gradYear: number;
  state: string;
  city: string;
  industry: string;
  isAlumni: boolean;
  bio: string;
  about?: string;
  initials: string;
  avatarUrl?: string;
  linkedin?: string;
  website?: string;
  publicEmail?: string;
}

export interface PlatformEvent {
  id: string;
  title: string;
  description: string;
  organizer: string;
  date: string; // ISO
  city: string;
  state: string;
  venue: string;
  lat: number;
  lng: number;
  attendees: number;
  category: "Meetup" | "Conference" | "Nauryz" | "Startup" | "Networking";
  ownerId?: string;
}

export interface DonationEntry {
  donor: string;
  amount: number;
  anonymous: boolean;
}

export type NewsCategory = "News" | "Story" | "Press";

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  coverUrl?: string;
  category: NewsCategory;
  date: string; // ISO
}

export interface Campaign {
  id: string;
  studentName: string;
  initials: string;
  university: string;
  major: string;
  degree: DegreeLevel;
  state: string;
  shortBio: string;
  story: string;
  goals: string[];
  target: number;
  raised: number;
  urgency: "Low" | "Medium" | "High";
  verified: boolean;
  donors: DonationEntry[];
  updates: { date: string; text: string }[];
  avatarUrl?: string;
}

export const members: Member[] = [
  {
    id: "m1",
    name: "Aisha Nurlanovna",
    university: "Stanford University",
    major: "Computer Science",
    degree: "Master's",
    gradYear: 2026,
    state: "California",
    city: "Palo Alto",
    industry: "AI / Machine Learning",
    isAlumni: false,
    bio: "Building ML systems for healthcare. Ex-research intern at a Bay Area lab.",
    initials: "AN",
  },
  {
    id: "m2",
    name: "Daniyar Sultanov",
    university: "MIT",
    major: "Aerospace Engineering",
    degree: "PhD",
    gradYear: 2027,
    state: "Massachusetts",
    city: "Cambridge",
    industry: "Aerospace",
    isAlumni: false,
    bio: "Researching propulsion systems. Founder of the campus Aerospace Club chapter.",
    initials: "DS",
  },
  {
    id: "m3",
    name: "Madina Ospanova",
    university: "Harvard University",
    major: "Economics",
    degree: "Bachelor's",
    gradYear: 2025,
    state: "Massachusetts",
    city: "Boston",
    industry: "Finance",
    isAlumni: false,
    bio: "Incoming analyst at a global bank. Mentor for first-gen students.",
    initials: "MO",
  },
  {
    id: "m4",
    name: "Timur Akhmetov",
    university: "UC Berkeley",
    major: "Data Science",
    degree: "Bachelor's",
    gradYear: 2024,
    state: "California",
    city: "Berkeley",
    industry: "Tech",
    isAlumni: true,
    bio: "Software engineer. Alumni mentor and angel investor in diaspora startups.",
    initials: "TA",
  },
  {
    id: "m5",
    name: "Aru Bekova",
    university: "Columbia University",
    major: "Biomedical Engineering",
    degree: "Master's",
    gradYear: 2026,
    state: "New York",
    city: "New York",
    industry: "Biotech",
    isAlumni: false,
    bio: "Developing diagnostic devices. Women in STEM organizer.",
    initials: "AB",
  },
  {
    id: "m6",
    name: "Yerlan Kazbekov",
    university: "University of Texas at Austin",
    major: "Petroleum Engineering",
    degree: "Bachelor's",
    gradYear: 2025,
    state: "Texas",
    city: "Austin",
    industry: "Energy",
    isAlumni: false,
    bio: "Energy transition advocate. Hackathon regular.",
    initials: "YK",
  },
  {
    id: "m7",
    name: "Saltanat Imangali",
    university: "Carnegie Mellon University",
    major: "Human-Computer Interaction",
    degree: "Master's",
    gradYear: 2026,
    state: "Pennsylvania",
    city: "Pittsburgh",
    industry: "Product Design",
    isAlumni: false,
    bio: "Product designer focused on accessibility.",
    initials: "SI",
  },
  {
    id: "m8",
    name: "Nurlan Abenov",
    university: "University of Michigan",
    major: "Mechanical Engineering",
    degree: "PhD",
    gradYear: 2028,
    state: "Michigan",
    city: "Ann Arbor",
    industry: "Robotics",
    isAlumni: false,
    bio: "Robotics researcher. Builds autonomous systems.",
    initials: "NA",
  },
];

export const events: PlatformEvent[] = [
  {
    id: "e1",
    title: "Nauryz Spring Gathering 2026",
    description: "Annual celebration of the Kazakh new year with food, music, and community.",
    organizer: "QSA National",
    date: "2026-03-21T17:00:00",
    city: "New York",
    state: "New York",
    venue: "Brooklyn Expo Center",
    lat: 40.7359,
    lng: -73.9911,
    attendees: 340,
    category: "Nauryz",
  },
  {
    id: "e2",
    title: "Bay Area Founders Mixer",
    description: "Meet Kazakh founders, operators, and investors in Silicon Valley.",
    organizer: "Founders Club",
    date: "2026-06-12T18:30:00",
    city: "San Francisco",
    state: "California",
    venue: "SoMa Startup Hub",
    lat: 37.7785,
    lng: -122.4056,
    attendees: 120,
    category: "Startup",
  },
  {
    id: "e3",
    title: "East Coast Career Conference",
    description: "Recruiting, panels, and resume workshops with alumni from top firms.",
    organizer: "QSA Careers",
    date: "2026-09-28T09:00:00",
    city: "Boston",
    state: "Massachusetts",
    venue: "MIT Media Lab",
    lat: 42.3608,
    lng: -71.0871,
    attendees: 210,
    category: "Conference",
  },
  {
    id: "e4",
    title: "Austin Tech Meetup",
    description: "Casual evening for students and engineers in Texas.",
    organizer: "QSA Texas",
    date: "2026-07-08T19:00:00",
    city: "Austin",
    state: "Texas",
    venue: "Capital Factory",
    lat: 30.2682,
    lng: -97.7404,
    attendees: 65,
    category: "Meetup",
  },
  {
    id: "e5",
    title: "Women in STEM Networking Night",
    description: "Connect with women leaders across science and engineering.",
    organizer: "Women in STEM",
    date: "2026-05-30T18:00:00",
    city: "Chicago",
    state: "Illinois",
    venue: "1871 Innovation Center",
    lat: 41.8857,
    lng: -87.6347,
    attendees: 90,
    category: "Networking",
  },
];

export const campaigns: Campaign[] = [
  {
    id: "c1",
    studentName: "Aibek Zhumagali",
    initials: "AZ",
    university: "Cornell University",
    major: "Computer Science",
    degree: "Bachelor's",
    state: "New York",
    shortBio: "First-gen student admitted to Cornell CS, raising funds to cover the tuition gap.",
    story:
      "I grew up in a small town near Almaty and became the first in my family to study abroad. Cornell offered me a partial scholarship, but a significant tuition gap remains. With the community's help I can focus on my studies and give back through mentorship and open-source work.",
    goals: [
      "Cover the remaining tuition gap for the academic year",
      "Afford on-campus housing close to labs",
      "Buy a development laptop for research",
    ],
    target: 25000,
    raised: 16400,
    urgency: "High",
    verified: true,
    donors: [
      { donor: "Timur A.", amount: 1000, anonymous: false },
      { donor: "Anonymous", amount: 500, anonymous: true },
      { donor: "Madina O.", amount: 250, anonymous: false },
      { donor: "QSA Alumni Fund", amount: 5000, anonymous: false },
    ],
    updates: [
      { date: "2026-04-02", text: "Reached 65% of the goal — thank you to every donor!" },
      { date: "2026-03-10", text: "Campaign verified by QSA moderators." },
    ],
  },
  {
    id: "c2",
    studentName: "Gulnara Serik",
    initials: "GS",
    university: "Johns Hopkins University",
    major: "Public Health",
    degree: "Master's",
    state: "Maryland",
    shortBio: "MPH candidate researching maternal health, raising funds for final-year tuition.",
    story:
      "My research focuses on improving maternal health outcomes in rural Central Asia. I am one year away from completing my Master of Public Health and need support to finish without taking on unsustainable debt.",
    goals: [
      "Fund the final two semesters of the MPH program",
      "Travel to a field site for data collection",
    ],
    target: 18000,
    raised: 4200,
    urgency: "Medium",
    verified: true,
    donors: [
      { donor: "Anonymous", amount: 2000, anonymous: true },
      { donor: "Aru B.", amount: 200, anonymous: false },
    ],
    updates: [{ date: "2026-04-15", text: "Acceptance letter and tuition verified." }],
  },
  {
    id: "c3",
    studentName: "Ruslan Daribay",
    initials: "RD",
    university: "Georgia Tech",
    major: "Electrical Engineering",
    degree: "PhD",
    state: "Georgia",
    shortBio: "PhD student building low-cost sensors, raising funds for a conference and equipment.",
    story:
      "I design affordable environmental sensors for developing regions. Presenting at an international conference would open doors to collaborations, and lab equipment would accelerate my prototypes.",
    goals: ["Cover travel to an IEEE conference", "Purchase prototyping equipment"],
    target: 9000,
    raised: 8100,
    urgency: "Low",
    verified: true,
    donors: [
      { donor: "Founders Club", amount: 3000, anonymous: false },
      { donor: "Daniyar S.", amount: 500, anonymous: false },
    ],
    updates: [{ date: "2026-04-20", text: "Almost funded — 90% reached!" }],
  },
];

export const newsPosts: NewsPost[] = [
  {
    id: "n1",
    title: "Association launches its national platform",
    excerpt: "A single home for Kazakh students and alumni across the United States.",
    body: "Today we are launching the association's platform — a permanent network connecting Kazakh students, graduates, founders, and professionals across the United States. The platform brings together a community directory, a map-first events system, student crowdfunding, and mentorship into one place. This is the first step toward building lasting infrastructure for the next generation of Kazakh talent.",
    category: "News",
    date: "2026-05-01",
  },
  {
    id: "n2",
    title: "From Almaty to Cornell: a first-generation story",
    excerpt: "How community support helped one student close the tuition gap.",
    body: "When Aibek was admitted to Cornell, a significant tuition gap stood between him and his dream. Through the association's crowdfunding community, donors large and small came together to help him enroll. His story is exactly why this network exists: talent should never be limited by geography or financial barriers.",
    category: "Story",
    date: "2026-04-18",
  },
];
