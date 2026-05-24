// UI + landing content in three languages. English is taken verbatim from the
// official Declaration of Purpose; Kazakh and Russian are faithful translations.
// Language order across the UI: Kazakh, English, Russian.

export const LOCALES = ["kk", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "kk";

export const LOCALE_LABELS: Record<Locale, string> = {
  kk: "kz",
  en: "en",
  ru: "ru",
};

interface TitleBody {
  title: string;
  body: string;
}

export interface Dictionary {
  nav: {
    directory: string;
    events: string;
    crowdfunding: string;
    news: string;
    home: string;
    signIn: string;
    join: string;
    account: string;
    moderation: string;
  };
  news: {
    title: string;
    sub: string;
    readMore: string;
    empty: string;
    back: string;
    create: string;
    catNews: string;
    catStory: string;
    catPress: string;
    gallery: string;
  };
  newsNew: {
    title: string;
    intro: string;
    notAuthorized: string;
    titleField: string;
    excerpt: string;
    body: string;
    category: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    cover: string;
    coverHint: string;
    images: string;
    imagesHint: string;
    uploading: string;
  };
  theme: { toLight: string; toDark: string };
  hero: {
    badge: string;
    titleA: string;
    highlight: string;
    titleB: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  mission: { heading: string; body: string };
  vision: { heading: string; body: string };
  beliefs: { heading: string; items: TitleBody[] };
  objectives: { heading: string; items: TitleBody[] };
  philosophy: { heading: string; body: string };
  values: { heading: string; items: TitleBody[] };
  finalStatement: { heading: string; body: string };
  featured: { heading: string; sub: string; link: string };
  eventsSection: { heading: string; sub: string; link: string };
  support: { heading: string; sub: string; link: string };
  sponsors: string;
  cta: { heading: string; body: string; primary: string; secondary: string };
  footer: {
    tagline: string;
    platform: string;
    community: string;
    about: string;
    rights: string;
    made: string;
    mission: string;
    sponsors: string;
    contact: string;
    clubs: string;
    mentorship: string;
    scholarships: string;
  };
  directory: {
    title: string;
    sub: string;
    searchPlaceholder: string;
    alumniOnly: string;
    alumni: string;
    classOf: string;
    resultsOne: string;
    resultsMany: string;
    empty: string;
    email: string;
    linkedin: string;
    website: string;
    viewProfile: string;
  };
  events: {
    title: string;
    sub: string;
    map: string;
    list: string;
    rsvp: string;
    when: string;
    where: string;
    organizer: string;
    attending: string;
    attendingShort: string;
    going: string;
    cancel: string;
    empty: string;
    mapLabel: string;
    create: string;
    attendeesHeading: string;
    attendeesEmpty: string;
    viewDetails: string;
    loginToRsvp: string;
    unregistered: string;
    showAll: string;
    showLess: string;
    location: string;
    about: string;
    back: string;
  };
  member: {
    back: string;
    edit: string;
    about: string;
    aboutEmpty: string;
    contact: string;
    details: string;
    notFound: string;
    classOf: string;
    alumni: string;
  };
  eventNew: {
    title: string;
    intro: string;
    loginRequired: string;
    titleField: string;
    description: string;
    category: string;
    date: string;
    city: string;
    state: string;
    venue: string;
    pickLocation: string;
    submit: string;
    submitting: string;
    error: string;
  };
  crowdfunding: {
    title: string;
    sub: string;
    sortUrgency: string;
    sortMost: string;
    sortLeast: string;
    verified: string;
    urgencySuffix: string;
    all: string;
    start: string;
  };
  campaignNew: {
    title: string;
    intro: string;
    loginRequired: string;
    studentName: string;
    university: string;
    major: string;
    degree: string;
    selectDegree: string;
    state: string;
    shortBio: string;
    story: string;
    goals: string;
    goalsHint: string;
    target: string;
    urgency: string;
    low: string;
    medium: string;
    high: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    images: string;
    imagesHint: string;
    video: string;
    videoHint: string;
    mustRegister: string;
    register: string;
    uploading: string;
  };
  moderation: {
    title: string;
    sub: string;
    notAuthorized: string;
    empty: string;
    approve: string;
    reject: string;
    pending: string;
    target: string;
    loadError: string;
  };
  campaign: {
    back: string;
    verified: string;
    story: string;
    goals: string;
    updates: string;
    donorWall: string;
    donors: string;
    toGo: string;
    anonymous: string;
    presetTitle: string;
    monthly: string;
    donateAnon: string;
    donate: string;
    secured: string;
    thanks: string;
    demoNote: string;
    customAmount: string;
    donorName: string;
    processing: string;
    donatedSuccess: string;
    gallery: string;
    video: string;
  };
  login: {
    welcome: string;
    joinTitle: string;
    signinSub: string;
    signupSub: string;
    google: string;
    or: string;
    email: string;
    password: string;
    signin: string;
    create: string;
    confirmNotice: string;
    toSignup: string;
    toSignin: string;
    notConfigured: string;
    notConfiguredBody: string;
  };
  account: {
    title: string;
    memberSince: string;
    method: string;
    signOut: string;
    loading: string;
    notConfigured: string;
  };
  profile: {
    heading: string;
    hint: string;
    name: string;
    university: string;
    major: string;
    degree: string;
    selectDegree: string;
    gradYear: string;
    state: string;
    city: string;
    industry: string;
    bio: string;
    bioHint: string;
    about: string;
    aboutHint: string;
    isAlumni: string;
    save: string;
    saving: string;
    saved: string;
    error: string;
    photo: string;
    uploadPhoto: string;
    uploading: string;
    contactHeading: string;
    linkedin: string;
    website: string;
    publicEmail: string;
    publicEmailHint: string;
    banner: string;
    uploadBanner: string;
    preview: string;
    backToEdit: string;
    previewNote: string;
  };
  cropper: {
    bannerTitle: string;
    avatarTitle: string;
    zoom: string;
    save: string;
    cancel: string;
    saving: string;
  };
}

export const translations: Record<Locale, Dictionary> = {
  en: {
    nav: {
      directory: "Directory",
      events: "Events",
      crowdfunding: "Crowdfunding",
      news: "News",
      home: "Home",
      signIn: "Sign in",
      join: "Join",
      account: "Account",
      moderation: "Moderation",
    },
    news: {
      title: "News & Media",
      sub: "Community updates, student highlights, and success stories.",
      readMore: "Read more →",
      empty: "No posts yet.",
      back: "← Back to news",
      create: "New post",
      catNews: "News",
      catStory: "Story",
      catPress: "Press",
      gallery: "Gallery",
    },
    newsNew: {
      title: "New post",
      intro: "Publish a community update, story, or press release.",
      notAuthorized: "You do not have access to this page.",
      titleField: "Title",
      excerpt: "Short excerpt",
      body: "Body",
      category: "Category",
      submit: "Publish",
      submitting: "Publishing…",
      success: "Published!",
      error: "Could not publish. Please try again.",
      cover: "Main photo (banner)",
      coverHint: "Shown as the banner in the news list and at the top of the article.",
      images: "Gallery photos",
      imagesHint: "Add more photos readers can scroll through.",
      uploading: "Uploading…",
    },
    theme: { toLight: "Light mode", toDark: "Dark mode" },
    hero: {
      badge: "Kazakh Students Association in the United States",
      titleA: "Infrastructure for the",
      highlight: "future of Kazakh talent",
      titleB: "in the United States.",
      subtitle:
        "A permanent network of Kazakh students, graduates, founders, researchers, and professionals — united by a shared responsibility toward the next generation.",
      ctaPrimary: "Join the association",
      ctaSecondary: "See upcoming events",
    },
    mission: {
      heading: "Mission",
      body: "To unite and empower Kazakh students and graduates in the United States through community, mentorship, opportunity, cultural identity, and financial support — building a self-sustaining ecosystem that advances the next generation of Kazakh global leaders.",
    },
    vision: {
      heading: "Vision",
      body: "To build the most influential global network of Kazakh talent abroad — one that creates lifelong connections, supports educational access, develops future leaders, and contributes to the intellectual, economic, and cultural future of Kazakhstan.",
    },
    beliefs: {
      heading: "Core beliefs",
      items: [
        { title: "Talent exists everywhere. Opportunity does not.", body: "Access to world-class education should not depend solely on wealth or privilege." },
        { title: "Community changes trajectories.", body: "One mentor, one introduction, one scholarship, or one act of support can completely alter a person's future." },
        { title: "Education abroad must create generational impact.", body: "Its highest purpose is multiplying knowledge, opportunity, and leadership for future generations." },
        { title: "Diaspora is power.", body: "Connections between students, alumni, founders, investors, and professionals create long-term institutional strength." },
        { title: "Success carries responsibility.", body: "Those who benefited from opportunity should help create it for others." },
      ],
    },
    objectives: {
      heading: "Primary objectives",
      items: [
        { title: "Community Building", body: "Create a strong social and professional network connecting Kazakh students and alumni across universities, states, and industries." },
        { title: "Mentorship & Guidance", body: "Provide students with mentorship, career guidance, academic support, and real-world experience from older students and graduates." },
        { title: "Educational Accessibility", body: "Support talented students facing financial barriers through crowdfunding, scholarships, sponsorships, and partnerships." },
        { title: "Cultural Representation", body: "Strengthen the presence of Kazakh culture, identity, and values within international academic and professional environments." },
        { title: "Leadership Development", body: "Encourage students to become future leaders, innovators, researchers, and founders capable of long-term impact." },
        { title: "Institutional Legacy", body: "Build a permanent intergenerational structure where each generation leaves stronger opportunities for the next." },
      ],
    },
    philosophy: {
      heading: "The crowdfunding philosophy",
      body: "Financial support within the association is not charity. It is belief in human potential. Students receiving support are not passive recipients, but future contributors capable of generating scientific, entrepreneurial, cultural, and societal value. Support today becomes a multiplied impact tomorrow.",
    },
    values: {
      heading: "Community values",
      items: [
        { title: "Excellence", body: "We encourage ambition, discipline, competence, and intellectual growth." },
        { title: "Integrity", body: "We value honesty, responsibility, transparency, and respect toward the community." },
        { title: "Continuity", body: "We believe every generation should strengthen the path for the next." },
        { title: "Unity", body: "We reject unnecessary division and isolation among students abroad." },
        { title: "Contribution", body: "We believe knowledge, opportunity, and success gain meaning when shared." },
      ],
    },
    finalStatement: {
      heading: "Final statement",
      body: "A nation's future is not built only through governments, resources, or borders. It is built through people. This association exists so that Kazakh students abroad do not walk alone — and so that future generations inherit not only inspiration, but structure, opportunity, and a community powerful enough to carry them further than any individual could go alone.",
    },
    featured: { heading: "Members", sub: "Students and alumni shaping their fields.", link: "View directory →" },
    eventsSection: { heading: "Upcoming events", sub: "Meetups, conferences, and Nauryz gatherings.", link: "Open the map →" },
    support: { heading: "Support a student", sub: "Verified campaigns from members who need a hand.", link: "Browse all →" },
    sponsors: "Backed by partners across the diaspora",
    cta: {
      heading: "Join the association",
      body: "Create your profile, connect with the network, and help build the future of Kazakh talent abroad.",
      primary: "Create your profile",
      secondary: "Start a campaign",
    },
    footer: {
      tagline: "Infrastructure for the future of Kazakh talent abroad.",
      platform: "Platform",
      community: "Community",
      about: "About",
      rights: "All rights reserved.",
      made: "Built for the diaspora, by the diaspora.",
      mission: "Mission",
      sponsors: "Sponsors",
      contact: "Contact",
      clubs: "Clubs & Organizations",
      mentorship: "Mentorship",
      scholarships: "Scholarships",
    },
    directory: {
      title: "Community Directory",
      sub: "Discover students and alumni across the network. Filter by university, major, state, industry, graduation year, and degree.",
      searchPlaceholder: "Search by name, major, university, or industry…",
      alumniOnly: "Alumni only",
      alumni: "Alumni",
      classOf: "Class of",
      resultsOne: "member",
      resultsMany: "members",
      empty: "No members match your filters yet.",
      email: "Email",
      linkedin: "LinkedIn",
      website: "Website",
      viewProfile: "View profile →",
    },
    events: {
      title: "Events",
      sub: "A map-first view of meetups, conferences, Nauryz gatherings, and startup events across the United States.",
      map: "Map",
      list: "List",
      rsvp: "RSVP",
      when: "When",
      where: "Where",
      organizer: "Organizer",
      attending: "Attending",
      attendingShort: "attending",
      going: "You're going",
      cancel: "Cancel RSVP",
      empty: "No events scheduled yet.",
      mapLabel: "Interactive map · USA",
      create: "Create event",
      attendeesHeading: "Who's coming",
      attendeesEmpty: "No one has RSVP'd yet.",
      viewDetails: "View details →",
      loginToRsvp: "Sign in to RSVP to this event.",
      unregistered: "Unregistered member",
      showAll: "Show all",
      showLess: "Show less",
      location: "Location",
      about: "About this event",
      back: "← Back to events",
    },
    member: {
      back: "← Back to directory",
      edit: "Edit profile",
      about: "About",
      aboutEmpty: "This member hasn't written an introduction yet.",
      contact: "Contact & links",
      details: "Details",
      notFound: "Member not found.",
      classOf: "Class of",
      alumni: "Alumni",
    },
    eventNew: {
      title: "Create an event",
      intro: "Add a meetup, conference, or gathering. Click the map to set the location.",
      loginRequired: "Please sign in to create an event.",
      titleField: "Title",
      description: "Description",
      category: "Category",
      date: "Date & time",
      city: "City",
      state: "State",
      venue: "Venue",
      pickLocation: "Click the map to place your event",
      submit: "Create event",
      submitting: "Creating…",
      error: "Could not create. Please try again.",
    },
    crowdfunding: {
      title: "Student Crowdfunding",
      sub: "Every campaign is reviewed by association moderators who verify acceptance letters and tuition data before publishing.",
      sortUrgency: "Sort: Urgency",
      sortMost: "Sort: Most raised",
      sortLeast: "Sort: Least funded",
      verified: "Verified",
      urgencySuffix: "urgency",
      all: "All",
      start: "Start a campaign",
    },
    campaignNew: {
      title: "Start a campaign",
      intro: "Submit your campaign for review. Moderators verify acceptance letters and tuition data before it goes live.",
      loginRequired: "Please sign in to start a campaign.",
      studentName: "Your name",
      university: "University",
      major: "Major",
      degree: "Degree level",
      selectDegree: "Select degree",
      state: "State",
      shortBio: "Short summary",
      story: "Your story",
      goals: "Goals",
      goalsHint: "One goal per line.",
      target: "Target amount (USD)",
      urgency: "Urgency",
      low: "Low",
      medium: "Medium",
      high: "High",
      submit: "Submit for review",
      submitting: "Submitting…",
      success: "Submitted! Your campaign is now pending moderator review.",
      error: "Could not submit. Please try again.",
      images: "Photos (up to 10)",
      imagesHint: "Show people what you've been working on.",
      video: "YouTube video (optional)",
      videoHint: "Paste a link to your official appeal or introduction.",
      mustRegister: "You need an account to start a campaign.",
      register: "Sign in or register",
      uploading: "Uploading…",
    },
    moderation: {
      title: "Moderation",
      sub: "Review and approve pending crowdfunding campaigns.",
      notAuthorized: "You do not have access to this page.",
      empty: "No campaigns pending review.",
      approve: "Approve",
      reject: "Reject",
      pending: "Pending",
      target: "Target",
      loadError: "Could not load campaigns.",
    },
    campaign: {
      back: "← Back to campaigns",
      verified: "Verified by association moderators",
      story: "Story",
      goals: "Goals",
      updates: "Updates",
      donorWall: "Donor wall",
      donors: "donors",
      toGo: "to go",
      anonymous: "Anonymous",
      presetTitle: "Choose an amount",
      monthly: "Make it monthly",
      donateAnon: "Donate anonymously",
      donate: "Donate",
      secured: "Secured by Stripe · PCI-compliant",
      thanks: "Thank you! Your pledge is recorded.",
      demoNote: "(Demo only — add Stripe keys to take real payments.)",
      customAmount: "Or enter a custom amount",
      donorName: "Name on the donor wall (optional)",
      processing: "Redirecting to checkout…",
      donatedSuccess: "Thank you for your donation! It may take a moment to appear.",
      gallery: "Gallery",
      video: "Video",
    },
    login: {
      welcome: "Welcome back",
      joinTitle: "Join the association",
      signinSub: "Sign in to access the community.",
      signupSub: "Create your account to join the network.",
      google: "Continue with Google",
      or: "or",
      email: "Email",
      password: "Password",
      signin: "Sign in",
      create: "Create account",
      confirmNotice: "Check your inbox to confirm your email, then sign in.",
      toSignup: "No account? Create one",
      toSignin: "Already have an account? Sign in",
      notConfigured: "Authentication not configured",
      notConfiguredBody: "Set the Supabase environment variables to enable sign in.",
    },
    account: {
      title: "Your account",
      memberSince: "Member since",
      method: "Sign-in method",
      signOut: "Sign out",
      loading: "Loading…",
      notConfigured: "Authentication is not configured yet.",
    },
    profile: {
      heading: "Your profile",
      hint: "Complete your profile to appear in the community directory.",
      name: "Full name",
      university: "University",
      major: "Major",
      degree: "Degree level",
      selectDegree: "Select degree",
      gradYear: "Graduation year",
      state: "State",
      city: "City",
      industry: "Industry",
      bio: "Short bio",
      bioHint: "One line shown on your directory card.",
      about: "About you",
      aboutHint: "A longer introduction shown on your full profile page.",
      isAlumni: "I am an alumnus / alumna",
      save: "Save profile",
      saving: "Saving…",
      saved: "Profile saved.",
      error: "Could not save. Please try again.",
      photo: "Profile photo",
      uploadPhoto: "Upload photo",
      uploading: "Uploading…",
      contactHeading: "Contact & links",
      linkedin: "LinkedIn URL",
      website: "Website",
      publicEmail: "Public email",
      publicEmailHint: "Shown on your directory card so members can reach you.",
      banner: "Cover banner",
      uploadBanner: "Upload banner",
      preview: "Preview public profile",
      backToEdit: "Back to editing",
      previewNote: "This is how other members see your profile.",
    },
    cropper: {
      bannerTitle: "Adjust your banner",
      avatarTitle: "Adjust your photo",
      zoom: "Zoom",
      save: "Save",
      cancel: "Cancel",
      saving: "Saving…",
    },
  },

  kk: {
    nav: {
      directory: "Каталог",
      events: "Іс-шаралар",
      crowdfunding: "Қаражат жинау",
      news: "Жаңалықтар",
      home: "Басты бет",
      signIn: "Кіру",
      join: "Қосылу",
      account: "Профиль",
      moderation: "Модерация",
    },
    news: {
      title: "Жаңалықтар мен медиа",
      sub: "Қоғамдастық жаңалықтары, студенттер жетістіктері және табыс әңгімелері.",
      readMore: "Толығырақ →",
      empty: "Әзірге жазба жоқ.",
      back: "← Жаңалықтарға оралу",
      create: "Жаңа жазба",
      catNews: "Жаңалық",
      catStory: "Әңгіме",
      catPress: "Баспасөз",
      gallery: "Галерея",
    },
    newsNew: {
      title: "Жаңа жазба",
      intro: "Қоғамдастық жаңалығын, әңгімені немесе баспасөз релизін жариялаңыз.",
      notAuthorized: "Бұл бетке кіруге рұқсатыңыз жоқ.",
      titleField: "Тақырып",
      excerpt: "Қысқаша үзінді",
      body: "Мәтін",
      category: "Санат",
      submit: "Жариялау",
      submitting: "Жариялануда…",
      success: "Жарияланды!",
      error: "Жариялау мүмкін болмады. Қайта көріңіз.",
      cover: "Негізгі сурет (баннер)",
      coverHint: "Жаңалықтар тізімінде және мақаланың жоғарысында баннер ретінде көрсетіледі.",
      images: "Галерея суреттері",
      imagesHint: "Оқырмандар қарай алатын қосымша суреттер қосыңыз.",
      uploading: "Жүктелуде…",
    },
    theme: { toLight: "Жарық режимі", toDark: "Қараңғы режим" },
    hero: {
      badge: "АҚШ-тағы қазақ студенттерінің қауымдастығы",
      titleA: "Қазақ талантының",
      highlight: "болашағына арналған инфрақұрылым",
      titleB: "Америка Құрама Штаттарында.",
      subtitle:
        "Қазақ студенттері, түлектері, кәсіпкерлері, зерттеушілері мен мамандарының тұрақты желісі — келер ұрпақ алдындағы ортақ жауапкершілікпен біріккен.",
      ctaPrimary: "Қауымдастыққа қосылу",
      ctaSecondary: "Алдағы іс-шаралар",
    },
    mission: {
      heading: "Миссия",
      body: "АҚШ-тағы қазақ студенттері мен түлектерін қоғамдастық, тәлімгерлік, мүмкіндік, мәдени бірегейлік және қаржылық қолдау арқылы біріктіру әрі күшейту — қазақ көшбасшыларының келер ұрпағын дамытатын өзін-өзі қамтамасыз ететін экожүйе құру.",
    },
    vision: {
      heading: "Көзқарас",
      body: "Шетелдегі қазақ талантының ең ықпалды жаһандық желісін құру — өмірлік байланыстар орнататын, білімге қолжетімділікті қолдайтын, болашақ көшбасшыларды тәрбиелейтін және Қазақстанның зияткерлік, экономикалық, мәдени болашағына үлес қосатын желі.",
    },
    beliefs: {
      heading: "Негізгі құндылықтар",
      items: [
        { title: "Талант барлық жерде бар. Мүмкіндік — жоқ.", body: "Әлемдік деңгейдегі білімге қолжетімділік тек байлық пен артықшылыққа байланысты болмауы керек." },
        { title: "Қоғамдастық тағдырды өзгертеді.", body: "Бір тәлімгер, бір таныстыру, бір стипендия немесе бір қолдау адамның болашағын түбегейлі өзгерте алады." },
        { title: "Шетелдегі білім ұрпақтарға әсер етуі тиіс.", body: "Оның ең жоғары мақсаты — білім, мүмкіндік пен көшбасшылықты келер ұрпаққа еселеп беру." },
        { title: "Диаспора — күш.", body: "Студенттер, түлектер, кәсіпкерлер мен мамандар арасындағы байланыс ұзақ мерзімді институттық беріктік жасайды." },
        { title: "Жетістік жауапкершілік артады.", body: "Мүмкіндіктен пайда көргендер оны басқаларға да жасауға көмектесуі керек." },
      ],
    },
    objectives: {
      heading: "Негізгі мақсаттар",
      items: [
        { title: "Қоғамдастық құру", body: "Университеттер, штаттар мен салалар бойынша қазақ студенттері мен түлектерін байланыстыратын мықты әлеуметтік әрі кәсіби желі құру." },
        { title: "Тәлімгерлік және бағыт-бағдар", body: "Студенттерге аға буын мен түлектерден тәлімгерлік, мансаптық кеңес, академиялық қолдау және нақты тәжірибе беру." },
        { title: "Білімге қолжетімділік", body: "Қаржылық кедергіге тап болған дарынды студенттерді қаражат жинау, стипендия, демеушілік және серіктестік арқылы қолдау." },
        { title: "Мәдени өкілдік", body: "Халықаралық академиялық және кәсіби ортада қазақ мәдениеті, бірегейлігі мен құндылықтарының болуын нығайту." },
        { title: "Көшбасшылықты дамыту", body: "Студенттерді ұзақ мерзімді әсер ете алатын болашақ көшбасшы, жаңашыл, зерттеуші және кәсіпкер болуға ынталандыру." },
        { title: "Институттық мұра", body: "Әр буын келесіге күшейтілген мүмкіндік қалдыратын тұрақты ұрпақаралық құрылым құру." },
      ],
    },
    philosophy: {
      heading: "Қаражат жинау философиясы",
      body: "Қауымдастық ішіндегі қаржылық қолдау — қайырымдылық емес. Бұл — адам әлеуетіне сену. Қолдау алушы студенттер енжар алушы емес, ғылыми, кәсіпкерлік, мәдени және әлеуметтік құндылық жасауға қабілетті болашақ үлес қосушылар. Бүгінгі қолдау ертең еселенген әсерге айналады.",
    },
    values: {
      heading: "Қоғамдастық құндылықтары",
      items: [
        { title: "Үздіктік", body: "Біз амбиция, тәртіп, біліктілік пен зияткерлік өсуді қолдаймыз." },
        { title: "Адалдық", body: "Біз шыншылдықты, жауапкершілікті, ашықтықты және қоғамдастыққа құрметті бағалаймыз." },
        { title: "Сабақтастық", body: "Әр буын келесінің жолын нығайтуы керек деп санаймыз." },
        { title: "Бірлік", body: "Шетелдегі студенттер арасындағы артық алауыздық пен оқшаулануды қабылдамаймыз." },
        { title: "Үлес қосу", body: "Білім, мүмкіндік пен жетістік бөліскенде ғана мән алады деп сенеміз." },
      ],
    },
    finalStatement: {
      heading: "Қорытынды сөз",
      body: "Ұлттың болашағы тек үкімет, ресурс немесе шекара арқылы құрылмайды. Ол адамдар арқылы құрылады. Бұл қауымдастық шетелдегі қазақ студенттері жалғыз жүрмеуі үшін бар — әрі келер ұрпақ тек шабыт қана емес, құрылым, мүмкіндік және әркімді жеке-дара жете алмайтын жерге жеткізетін қоғамдастық алуы үшін.",
    },
    featured: { heading: "Қатысушылар", sub: "Өз салаларын қалыптастырып жүрген студенттер мен түлектер.", link: "Каталогты ашу →" },
    eventsSection: { heading: "Алдағы іс-шаралар", sub: "Кездесулер, конференциялар және Наурыз жиындары.", link: "Картаны ашу →" },
    support: { heading: "Студентті қолдау", sub: "Көмекке мұқтаж қатысушылардың тексерілген науқандары.", link: "Барлығын көру →" },
    sponsors: "Диаспорадағы серіктестердің қолдауымен",
    cta: {
      heading: "Қауымдастыққа қосылыңыз",
      body: "Профиль жасаңыз, желіге қосылыңыз және шетелдегі қазақ талантының болашағын құруға үлес қосыңыз.",
      primary: "Профиль жасау",
      secondary: "Науқан бастау",
    },
    footer: {
      tagline: "Шетелдегі қазақ талантының болашағына арналған инфрақұрылым.",
      platform: "Платформа",
      community: "Қоғамдастық",
      about: "Туралы",
      rights: "Барлық құқықтар қорғалған.",
      made: "Диаспора үшін, диаспора қолымен жасалған.",
      mission: "Миссия",
      sponsors: "Демеушілер",
      contact: "Байланыс",
      clubs: "Клубтар мен ұйымдар",
      mentorship: "Тәлімгерлік",
      scholarships: "Стипендиялар",
    },
    directory: {
      title: "Қоғамдастық каталогы",
      sub: "Желідегі студенттер мен түлектерді табыңыз. Университет, мамандық, штат, сала, бітіру жылы және дәреже бойынша сүзгілеңіз.",
      searchPlaceholder: "Аты, мамандығы, университеті немесе саласы бойынша іздеу…",
      alumniOnly: "Тек түлектер",
      alumni: "Түлек",
      classOf: "Бітіру жылы",
      resultsOne: "қатысушы",
      resultsMany: "қатысушы",
      empty: "Сүзгіге сай қатысушы табылмады.",
      email: "Эл. пошта",
      linkedin: "LinkedIn",
      website: "Сайт",
      viewProfile: "Профильді ашу →",
    },
    events: {
      title: "Іс-шаралар",
      sub: "АҚШ бойынша кездесулер, конференциялар, Наурыз жиындары мен стартап іс-шараларының картадағы көрінісі.",
      map: "Карта",
      list: "Тізім",
      rsvp: "Тіркелу",
      when: "Қашан",
      where: "Қайда",
      organizer: "Ұйымдастырушы",
      attending: "Қатысады",
      attendingShort: "қатысады",
      going: "Сіз қатысасыз",
      cancel: "Бас тарту",
      empty: "Әзірге жоспарланған іс-шара жоқ.",
      mapLabel: "Интерактивті карта · АҚШ",
      create: "Іс-шара құру",
      attendeesHeading: "Кім келеді",
      attendeesEmpty: "Әзірге ешкім тіркелмеген.",
      viewDetails: "Толығырақ →",
      loginToRsvp: "Тіркелу үшін жүйеге кіріңіз.",
      unregistered: "Тіркелмеген қатысушы",
      showAll: "Барлығын көрсету",
      showLess: "Жасыру",
      location: "Орналасуы",
      about: "Іс-шара туралы",
      back: "← Іс-шараларға оралу",
    },
    member: {
      back: "← Каталогқа оралу",
      edit: "Профильді өзгерту",
      about: "Өзі туралы",
      aboutEmpty: "Бұл қатысушы әзірге өзі туралы жазбаған.",
      contact: "Байланыс және сілтемелер",
      details: "Мәліметтер",
      notFound: "Қатысушы табылмады.",
      classOf: "Бітіру жылы",
      alumni: "Түлек",
    },
    eventNew: {
      title: "Іс-шара құру",
      intro: "Кездесу, конференция немесе жиын қосыңыз. Орналасуын белгілеу үшін картаны басыңыз.",
      loginRequired: "Іс-шара құру үшін жүйеге кіріңіз.",
      titleField: "Тақырып",
      description: "Сипаттама",
      category: "Санат",
      date: "Күні мен уақыты",
      city: "Қала",
      state: "Штат",
      venue: "Орын",
      pickLocation: "Іс-шараны орналастыру үшін картаны басыңыз",
      submit: "Іс-шара құру",
      submitting: "Құрылуда…",
      error: "Құру мүмкін болмады. Қайта көріңіз.",
    },
    crowdfunding: {
      title: "Студенттерге қаражат жинау",
      sub: "Әр науқанды жариялаудан бұрын қауымдастық модераторлары қабылдау хаттары мен оқу ақысы деректерін тексереді.",
      sortUrgency: "Сұрыптау: Шұғылдық",
      sortMost: "Сұрыптау: Көп жиналған",
      sortLeast: "Сұрыптау: Аз қаржыланған",
      verified: "Тексерілген",
      urgencySuffix: "шұғылдық",
      all: "Барлығы",
      start: "Науқан бастау",
    },
    campaignNew: {
      title: "Науқан бастау",
      intro: "Науқаныңызды тексеруге жіберіңіз. Модераторлар жариялаудан бұрын қабылдау хаттары мен оқу ақысын тексереді.",
      loginRequired: "Науқан бастау үшін жүйеге кіріңіз.",
      studentName: "Атыңыз",
      university: "Университет",
      major: "Мамандық",
      degree: "Дәреже деңгейі",
      selectDegree: "Дәрежені таңдаңыз",
      state: "Штат",
      shortBio: "Қысқаша сипаттама",
      story: "Сіздің әңгімеңіз",
      goals: "Мақсаттар",
      goalsHint: "Әр жолда бір мақсат.",
      target: "Мақсатты сома (USD)",
      urgency: "Шұғылдық",
      low: "Төмен",
      medium: "Орташа",
      high: "Жоғары",
      submit: "Тексеруге жіберу",
      submitting: "Жіберілуде…",
      success: "Жіберілді! Науқаныңыз модератор тексеруін күтуде.",
      error: "Жіберу мүмкін болмады. Қайта көріңіз.",
      images: "Суреттер (10-ға дейін)",
      imagesHint: "Немен айналысқаныңызды адамдарға көрсетіңіз.",
      video: "YouTube видеосы (міндетті емес)",
      videoHint: "Ресми үндеуіңізге немесе таныстырылымыңызға сілтеме қойыңыз.",
      mustRegister: "Науқан бастау үшін аккаунт қажет.",
      register: "Кіру немесе тіркелу",
      uploading: "Жүктелуде…",
    },
    moderation: {
      title: "Модерация",
      sub: "Күтудегі қаражат жинау науқандарын қарап, мақұлдаңыз.",
      notAuthorized: "Бұл бетке кіруге рұқсатыңыз жоқ.",
      empty: "Тексеруді күтетін науқан жоқ.",
      approve: "Мақұлдау",
      reject: "Бас тарту",
      pending: "Күтуде",
      target: "Мақсат",
      loadError: "Науқандарды жүктеу мүмкін болмады.",
    },
    campaign: {
      back: "← Науқандарға оралу",
      verified: "Қауымдастық модераторлары растаған",
      story: "Әңгіме",
      goals: "Мақсаттар",
      updates: "Жаңартулар",
      donorWall: "Демеушілер қабырғасы",
      donors: "демеуші",
      toGo: "қалды",
      anonymous: "Аноним",
      presetTitle: "Сома таңдаңыз",
      monthly: "Ай сайын төлеу",
      donateAnon: "Анонимді түрде беру",
      donate: "Қолдау көрсету",
      secured: "Stripe арқылы қорғалған · PCI стандарты",
      thanks: "Рақмет! Сіздің жарнаңыз тіркелді.",
      demoNote: "(Демо ғана — нақты төлем үшін Stripe кілттерін қосыңыз.)",
      customAmount: "Немесе өз сомаңызды енгізіңіз",
      donorName: "Демеушілер қабырғасындағы атыңыз (міндетті емес)",
      processing: "Төлемге бағыттауда…",
      donatedSuccess: "Қайырымдылығыңызға рақмет! Көріну үшін біраз уақыт кетуі мүмкін.",
      gallery: "Галерея",
      video: "Видео",
    },
    login: {
      welcome: "Қайта келдіңіз",
      joinTitle: "Қауымдастыққа қосылу",
      signinSub: "Қоғамдастыққа кіру үшін жүйеге кіріңіз.",
      signupSub: "Желіге қосылу үшін аккаунт жасаңыз.",
      google: "Google арқылы жалғастыру",
      or: "немесе",
      email: "Электрондық пошта",
      password: "Құпиясөз",
      signin: "Кіру",
      create: "Аккаунт жасау",
      confirmNotice: "Поштаңызды растаңыз, содан соң жүйеге кіріңіз.",
      toSignup: "Аккаунт жоқ па? Жасаңыз",
      toSignin: "Аккаунт бар ма? Кіріңіз",
      notConfigured: "Аутентификация бапталмаған",
      notConfiguredBody: "Кіруді қосу үшін Supabase айнымалыларын орнатыңыз.",
    },
    account: {
      title: "Сіздің аккаунт",
      memberSince: "Тіркелген уақыты",
      method: "Кіру тәсілі",
      signOut: "Шығу",
      loading: "Жүктелуде…",
      notConfigured: "Аутентификация әзірге бапталмаған.",
    },
    profile: {
      heading: "Сіздің профиль",
      hint: "Қоғамдастық каталогында көріну үшін профиліңізді толтырыңыз.",
      name: "Толық аты-жөні",
      university: "Университет",
      major: "Мамандық",
      degree: "Дәреже деңгейі",
      selectDegree: "Дәрежені таңдаңыз",
      gradYear: "Бітіру жылы",
      state: "Штат",
      city: "Қала",
      industry: "Сала",
      bio: "Қысқаша өмірбаян",
      bioHint: "Каталог картаңызда көрсетілетін бір жол.",
      about: "Өзіңіз туралы",
      aboutHint: "Толық профиль бетіңізде көрсетілетін кеңірек таныстырылым.",
      isAlumni: "Мен түлекпін",
      save: "Профильді сақтау",
      saving: "Сақталуда…",
      saved: "Профиль сақталды.",
      error: "Сақтау мүмкін болмады. Қайта көріңіз.",
      photo: "Профиль фотосы",
      uploadPhoto: "Фото жүктеу",
      uploading: "Жүктелуде…",
      contactHeading: "Байланыс және сілтемелер",
      linkedin: "LinkedIn сілтемесі",
      website: "Сайт",
      publicEmail: "Ашық эл. пошта",
      publicEmailHint: "Қатысушылар хабарласа алуы үшін каталог картаңызда көрсетіледі.",
      banner: "Мұқаба баннер",
      uploadBanner: "Баннер жүктеу",
      preview: "Ашық профильді алдын ала қарау",
      backToEdit: "Өңдеуге оралу",
      previewNote: "Профиліңізді басқа қатысушылар осылай көреді.",
    },
    cropper: {
      bannerTitle: "Баннерді реттеу",
      avatarTitle: "Фотоны реттеу",
      zoom: "Масштаб",
      save: "Сақтау",
      cancel: "Бас тарту",
      saving: "Сақталуда…",
    },
  },

  ru: {
    nav: {
      directory: "Каталог",
      events: "События",
      crowdfunding: "Сбор средств",
      news: "Новости",
      home: "Главная",
      signIn: "Войти",
      join: "Вступить",
      account: "Профиль",
      moderation: "Модерация",
    },
    news: {
      title: "Новости и медиа",
      sub: "Новости сообщества, достижения студентов и истории успеха.",
      readMore: "Подробнее →",
      empty: "Пока нет публикаций.",
      back: "← Назад к новостям",
      create: "Новый пост",
      catNews: "Новость",
      catStory: "История",
      catPress: "Пресса",
      gallery: "Галерея",
    },
    newsNew: {
      title: "Новый пост",
      intro: "Опубликуйте новость сообщества, историю или пресс-релиз.",
      notAuthorized: "У вас нет доступа к этой странице.",
      titleField: "Заголовок",
      excerpt: "Краткое описание",
      body: "Текст",
      category: "Категория",
      submit: "Опубликовать",
      submitting: "Публикация…",
      success: "Опубликовано!",
      error: "Не удалось опубликовать. Попробуйте снова.",
      cover: "Главное фото (баннер)",
      coverHint: "Показывается баннером в списке новостей и вверху статьи.",
      images: "Фото галереи",
      imagesHint: "Добавьте больше фото, которые читатели смогут пролистать.",
      uploading: "Загрузка…",
    },
    theme: { toLight: "Светлая тема", toDark: "Тёмная тема" },
    hero: {
      badge: "Ассоциация казахских студентов в США",
      titleA: "Инфраструктура для",
      highlight: "будущего казахского таланта",
      titleB: "в Соединённых Штатах.",
      subtitle:
        "Постоянная сеть казахских студентов, выпускников, основателей, исследователей и профессионалов — объединённых общей ответственностью перед следующим поколением.",
      ctaPrimary: "Вступить в ассоциацию",
      ctaSecondary: "Ближайшие события",
    },
    mission: {
      heading: "Миссия",
      body: "Объединять и поддерживать казахских студентов и выпускников в США через сообщество, наставничество, возможности, культурную идентичность и финансовую помощь — создавая самодостаточную экосистему, развивающую новое поколение казахских лидеров.",
    },
    vision: {
      heading: "Видение",
      body: "Построить самую влиятельную глобальную сеть казахского таланта за рубежом — создающую связи на всю жизнь, поддерживающую доступ к образованию, развивающую будущих лидеров и вносящую вклад в интеллектуальное, экономическое и культурное будущее Казахстана.",
    },
    beliefs: {
      heading: "Ключевые убеждения",
      items: [
        { title: "Талант есть везде. Возможности — нет.", body: "Доступ к образованию мирового уровня не должен зависеть только от богатства или привилегий." },
        { title: "Сообщество меняет траектории.", body: "Один наставник, одно знакомство, одна стипендия или один поступок поддержки могут полностью изменить будущее человека." },
        { title: "Образование за рубежом должно иметь влияние на поколения.", body: "Его высшая цель — умножать знания, возможности и лидерство для будущих поколений." },
        { title: "Диаспора — это сила.", body: "Связи между студентами, выпускниками, основателями, инвесторами и профессионалами создают долгосрочную институциональную прочность." },
        { title: "Успех несёт ответственность.", body: "Те, кто получил возможности, должны помогать создавать их для других." },
      ],
    },
    objectives: {
      heading: "Основные цели",
      items: [
        { title: "Создание сообщества", body: "Создать сильную социальную и профессиональную сеть, связывающую казахских студентов и выпускников между университетами, штатами и отраслями." },
        { title: "Наставничество и поддержка", body: "Давать студентам наставничество, карьерные советы, академическую поддержку и реальный опыт от старших студентов и выпускников." },
        { title: "Доступность образования", body: "Поддерживать талантливых студентов с финансовыми барьерами через сбор средств, стипендии, спонсорство и партнёрства." },
        { title: "Культурное представительство", body: "Усиливать присутствие казахской культуры, идентичности и ценностей в международной академической и профессиональной среде." },
        { title: "Развитие лидерства", body: "Поощрять студентов становиться будущими лидерами, новаторами, исследователями и основателями с долгосрочным влиянием." },
        { title: "Институциональное наследие", body: "Построить постоянную структуру между поколениями, где каждое оставляет следующему более сильные возможности." },
      ],
    },
    philosophy: {
      heading: "Философия сбора средств",
      body: "Финансовая поддержка в ассоциации — не благотворительность. Это вера в человеческий потенциал. Получающие поддержку студенты — не пассивные получатели, а будущие создатели научной, предпринимательской, культурной и общественной ценности. Поддержка сегодня становится умноженным влиянием завтра.",
    },
    values: {
      heading: "Ценности сообщества",
      items: [
        { title: "Совершенство", body: "Мы поощряем амбиции, дисциплину, компетентность и интеллектуальный рост." },
        { title: "Честность", body: "Мы ценим честность, ответственность, прозрачность и уважение к сообществу." },
        { title: "Преемственность", body: "Мы верим, что каждое поколение должно укреплять путь для следующего." },
        { title: "Единство", body: "Мы отвергаем ненужное разделение и изоляцию среди студентов за рубежом." },
        { title: "Вклад", body: "Мы верим, что знания, возможности и успех обретают смысл, когда ими делятся." },
      ],
    },
    finalStatement: {
      heading: "Заключение",
      body: "Будущее нации строится не только правительствами, ресурсами или границами. Оно строится людьми. Эта ассоциация существует, чтобы казахские студенты за рубежом не шли в одиночку — и чтобы будущие поколения наследовали не только вдохновение, но и структуру, возможности и сообщество, способное привести их дальше, чем любой смог бы в одиночку.",
    },
    featured: { heading: "Участники", sub: "Студенты и выпускники, формирующие свои области.", link: "Открыть каталог →" },
    eventsSection: { heading: "Ближайшие события", sub: "Встречи, конференции и празднования Наурыза.", link: "Открыть карту →" },
    support: { heading: "Поддержать студента", sub: "Проверенные кампании участников, которым нужна помощь.", link: "Смотреть все →" },
    sponsors: "При поддержке партнёров по всей диаспоре",
    cta: {
      heading: "Вступайте в ассоциацию",
      body: "Создайте профиль, подключитесь к сети и помогите строить будущее казахского таланта за рубежом.",
      primary: "Создать профиль",
      secondary: "Начать кампанию",
    },
    footer: {
      tagline: "Инфраструктура для будущего казахского таланта за рубежом.",
      platform: "Платформа",
      community: "Сообщество",
      about: "О нас",
      rights: "Все права защищены.",
      made: "Создано для диаспоры, силами диаспоры.",
      mission: "Миссия",
      sponsors: "Спонсоры",
      contact: "Контакты",
      clubs: "Клубы и организации",
      mentorship: "Наставничество",
      scholarships: "Стипендии",
    },
    directory: {
      title: "Каталог сообщества",
      sub: "Находите студентов и выпускников по сети. Фильтруйте по университету, специальности, штату, отрасли, году выпуска и степени.",
      searchPlaceholder: "Поиск по имени, специальности, университету или отрасли…",
      alumniOnly: "Только выпускники",
      alumni: "Выпускник",
      classOf: "Выпуск",
      resultsOne: "участник",
      resultsMany: "участников",
      empty: "Нет участников по вашим фильтрам.",
      email: "Эл. почта",
      linkedin: "LinkedIn",
      website: "Сайт",
      viewProfile: "Открыть профиль →",
    },
    events: {
      title: "События",
      sub: "Карта встреч, конференций, празднований Наурыза и стартап-событий по всем США.",
      map: "Карта",
      list: "Список",
      rsvp: "Регистрация",
      when: "Когда",
      where: "Где",
      organizer: "Организатор",
      attending: "Идут",
      attendingShort: "идут",
      going: "Вы идёте",
      cancel: "Отменить",
      empty: "Пока нет запланированных событий.",
      mapLabel: "Интерактивная карта · США",
      create: "Создать событие",
      attendeesHeading: "Кто придёт",
      attendeesEmpty: "Пока никто не записался.",
      viewDetails: "Подробнее →",
      loginToRsvp: "Войдите, чтобы зарегистрироваться на событие.",
      unregistered: "Незарегистрированный участник",
      showAll: "Показать всех",
      showLess: "Свернуть",
      location: "Место",
      about: "О событии",
      back: "← Назад к событиям",
    },
    member: {
      back: "← Назад в каталог",
      edit: "Редактировать профиль",
      about: "О себе",
      aboutEmpty: "Участник пока не добавил описание.",
      contact: "Контакты и ссылки",
      details: "Детали",
      notFound: "Участник не найден.",
      classOf: "Выпуск",
      alumni: "Выпускник",
    },
    eventNew: {
      title: "Создать событие",
      intro: "Добавьте встречу, конференцию или сбор. Кликните по карте, чтобы указать место.",
      loginRequired: "Войдите, чтобы создать событие.",
      titleField: "Название",
      description: "Описание",
      category: "Категория",
      date: "Дата и время",
      city: "Город",
      state: "Штат",
      venue: "Место",
      pickLocation: "Кликните по карте, чтобы разместить событие",
      submit: "Создать событие",
      submitting: "Создание…",
      error: "Не удалось создать. Попробуйте снова.",
    },
    crowdfunding: {
      title: "Сбор средств для студентов",
      sub: "Каждую кампанию перед публикацией проверяют модераторы ассоциации, подтверждая письма о зачислении и данные об оплате обучения.",
      sortUrgency: "Сортировка: Срочность",
      sortMost: "Сортировка: Больше собрано",
      sortLeast: "Сортировка: Меньше профинансировано",
      verified: "Проверено",
      urgencySuffix: "срочность",
      all: "Все",
      start: "Начать кампанию",
    },
    campaignNew: {
      title: "Начать кампанию",
      intro: "Отправьте кампанию на проверку. Модераторы подтверждают письма о зачислении и данные об оплате обучения перед публикацией.",
      loginRequired: "Войдите, чтобы начать кампанию.",
      studentName: "Ваше имя",
      university: "Университет",
      major: "Специальность",
      degree: "Уровень степени",
      selectDegree: "Выберите степень",
      state: "Штат",
      shortBio: "Краткое описание",
      story: "Ваша история",
      goals: "Цели",
      goalsHint: "По одной цели в строке.",
      target: "Целевая сумма (USD)",
      urgency: "Срочность",
      low: "Низкая",
      medium: "Средняя",
      high: "Высокая",
      submit: "Отправить на проверку",
      submitting: "Отправка…",
      success: "Отправлено! Кампания ожидает проверки модератором.",
      error: "Не удалось отправить. Попробуйте снова.",
      images: "Фото (до 10)",
      imagesHint: "Покажите людям, чем вы занимались.",
      video: "Видео с YouTube (необязательно)",
      videoHint: "Вставьте ссылку на официальное обращение или знакомство.",
      mustRegister: "Чтобы начать кампанию, нужен аккаунт.",
      register: "Войти или зарегистрироваться",
      uploading: "Загрузка…",
    },
    moderation: {
      title: "Модерация",
      sub: "Проверяйте и одобряйте кампании, ожидающие публикации.",
      notAuthorized: "У вас нет доступа к этой странице.",
      empty: "Нет кампаний на проверке.",
      approve: "Одобрить",
      reject: "Отклонить",
      pending: "На проверке",
      target: "Цель",
      loadError: "Не удалось загрузить кампании.",
    },
    campaign: {
      back: "← Назад к кампаниям",
      verified: "Проверено модераторами ассоциации",
      story: "История",
      goals: "Цели",
      updates: "Обновления",
      donorWall: "Стена доноров",
      donors: "доноров",
      toGo: "осталось",
      anonymous: "Аноним",
      presetTitle: "Выберите сумму",
      monthly: "Сделать ежемесячным",
      donateAnon: "Пожертвовать анонимно",
      donate: "Поддержать",
      secured: "Защищено Stripe · стандарт PCI",
      thanks: "Спасибо! Ваш взнос записан.",
      demoNote: "(Только демо — добавьте ключи Stripe для реальных платежей.)",
      customAmount: "Или введите свою сумму",
      donorName: "Имя на стене доноров (необязательно)",
      processing: "Перенаправляем на оплату…",
      donatedSuccess: "Спасибо за пожертвование! Оно появится через мгновение.",
      gallery: "Галерея",
      video: "Видео",
    },
    login: {
      welcome: "С возвращением",
      joinTitle: "Вступить в ассоциацию",
      signinSub: "Войдите, чтобы получить доступ к сообществу.",
      signupSub: "Создайте аккаунт, чтобы присоединиться к сети.",
      google: "Продолжить с Google",
      or: "или",
      email: "Эл. почта",
      password: "Пароль",
      signin: "Войти",
      create: "Создать аккаунт",
      confirmNotice: "Подтвердите почту в письме, затем войдите.",
      toSignup: "Нет аккаунта? Создайте",
      toSignin: "Уже есть аккаунт? Войдите",
      notConfigured: "Аутентификация не настроена",
      notConfiguredBody: "Задайте переменные окружения Supabase, чтобы включить вход.",
    },
    account: {
      title: "Ваш аккаунт",
      memberSince: "Участник с",
      method: "Способ входа",
      signOut: "Выйти",
      loading: "Загрузка…",
      notConfigured: "Аутентификация ещё не настроена.",
    },
    profile: {
      heading: "Ваш профиль",
      hint: "Заполните профиль, чтобы появиться в каталоге сообщества.",
      name: "Полное имя",
      university: "Университет",
      major: "Специальность",
      degree: "Уровень степени",
      selectDegree: "Выберите степень",
      gradYear: "Год выпуска",
      state: "Штат",
      city: "Город",
      industry: "Отрасль",
      bio: "Краткая биография",
      bioHint: "Одна строка для карточки в каталоге.",
      about: "О себе",
      aboutHint: "Более подробное описание для полной страницы профиля.",
      isAlumni: "Я выпускник / выпускница",
      save: "Сохранить профиль",
      saving: "Сохранение…",
      saved: "Профиль сохранён.",
      error: "Не удалось сохранить. Попробуйте снова.",
      photo: "Фото профиля",
      uploadPhoto: "Загрузить фото",
      uploading: "Загрузка…",
      contactHeading: "Контакты и ссылки",
      linkedin: "Ссылка LinkedIn",
      website: "Сайт",
      publicEmail: "Публичная почта",
      publicEmailHint: "Показывается на карточке в каталоге, чтобы с вами могли связаться.",
      banner: "Баннер обложки",
      uploadBanner: "Загрузить баннер",
      preview: "Предпросмотр профиля",
      backToEdit: "Вернуться к редактированию",
      previewNote: "Так ваш профиль видят другие участники.",
    },
    cropper: {
      bannerTitle: "Настройте баннер",
      avatarTitle: "Настройте фото",
      zoom: "Масштаб",
      save: "Сохранить",
      cancel: "Отмена",
      saving: "Сохранение…",
    },
  },
};
