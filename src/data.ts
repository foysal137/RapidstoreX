export interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image?: string;
  tag?: string;
  downloads?: string;
  rating?: string;
  safety?: string;
  category?: string;
  collectionId?: string;
  editorsChoice?: boolean;
  hasMod?: boolean;
  isOffline?: boolean;
  
  // Custom Google Play Console specifications
  description?: string;
  screenshots?: string[];
  versionName?: string;
  versionCode?: string;
  version?: string;
  apkUrl?: string;
  apkSize?: string;
  releaseTrack?: string;
  developerName?: string;
  developer?: string;
  developerEmail?: string;
  submittedBy?: string;
  status?: string;
}

export interface StorageSettings {
  activeType: "none" | "aws_s3" | "cloudflare_r2" | "digitalocean_spaces" | "bucketbuzz" | "telegram" | "ftp";
  aws: {
    bucketName: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    folder: string;
  };
  r2: {
    accountId: string;
    bucketName: string;
    accessKeyId: string;
    secretAccessKey: string;
    customDomain: string;
  };
  digitalocean: {
    spaceName: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    folder: string;
  };
  bucketbuzz: {
    bucketKey: string;
    secretToken: string;
    endpoint: string;
  };
  telegram: {
    botToken: string;
    chatId: string;
  };
  ftp: {
    host: string;
    port: string;
    username: string;
    password: string;
    folder: string;
    publicUrl: string;
  };
}

export interface AppStoreState {
  headerTags: string[];
  heroBanners: AppItem[];
  mmorpgApps: AppItem[];
  latestUpdates: AppItem[];
  mustHaveCollections: { id: string; title: string; image: string; description?: string; active?: boolean }[];
  newReleases: AppItem[];
  worldCupApps: AppItem[];
  topDownloads: AppItem[];
  paidForYou: AppItem[];
  news: Array<{ id: string; title: string; content: string; date: string; thumbnail?: string; category?: string; views?: string; readTime?: string }>;
  siteSettings: {
    title: string;
    description: string;
    developerName: string;
    contactEmail: string;
    bannerText: string;
    customAdHtml?: string;
    promoBanner: {
      title: string;
      subtitle: string;
      appId: string;
      tagText: string;
      buttonText: string;
      enabled: boolean;
    };
    adPlacements?: {
      appsPage: string;
      gamesPage: string;
      browsePage: string;
      appDetailTop: string;
      appDetailBottom: string;
    };
    customAds: { id: string; title: string; imageUrl: string; link: string; active: boolean }[];
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  infoPages?: {
    aboutUs: string;
    aboutStore: string;
    editorialPolicy: string;
    transparency: string;
    clientNotes: string;
    clientApkUrl: string;
    clientApkSize: string;
  };
  dbSettings: {
    type: string;
    host: string;
    port: string;
    status: "Connected" | "Disconnected" | "Error";
    databaseName: string;
  };
  storageSettings?: StorageSettings;
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    password?: string;
    username?: string;
    dob?: string;
    phone?: string;
  }>;
}

const DEFAULT_STATE: AppStoreState = {
  headerTags: [
    "GAMES",
    "APPS",
    "NEW RELEASES",
    "TOP DOWNLOADS"
  ],
  heroBanners: [],
  mmorpgApps: [],
  latestUpdates: [],
  mustHaveCollections: [],
  newReleases: [],
  worldCupApps: [],
  topDownloads: [],
  paidForYou: [],
  news: [],
  siteSettings: {
    title: "RapidAPK",
    description: "RapidAPK is a multiplatform app store specialized in Android. Our goal is to provide free and open access to a large catalog of apps without restrictions, offering a modern distribution platform directly from your browser.",
    developerName: "RapidAPK Developer",
    contactEmail: "contact@rapidapk.com",
    bannerText: "DISCOVER THE BEST ANDROID APPS. 100% FREE AND SECURE.",
    customAdHtml: "",
    promoBanner: {
      title: "Discover Best Apps",
      subtitle: "Explore our verified collection of Android applications.",
      appId: "",
      tagText: "Verified",
      buttonText: "Browse Now",
      enabled: true
    },
    adPlacements: {
      appsPage: "",
      gamesPage: "",
      browsePage: "",
      appDetailTop: "",
      appDetailBottom: ""
    },
    customAds: []
  },
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com"
  },
  infoPages: {
    aboutUs: "This RapidAPK is proudly run and managed by a single individual. Unlike massive profit-driven corporate app malls, this project was built from a passion to support developer transparency, privacy-respecting tools, and quick, clutter-free access.",
    aboutStore: "RapidAPK is a multiplatform app store specialized in Android. Our goal is to provide free and open access to a large catalog of apps without restrictions, offering a modern distribution platform directly from your browser.",
    editorialPolicy: "Every application listed on our store must submit to rigorous checks. Since I am an individual operator, I focus only on top quality products that are safe, lightweight, and genuinely valuable to users.\n\n• No Repetitive Clones: We filter spammy, low-value generic re-builds.\n• Active Antivirus Auditing: Packages are matched against virus definitions before inclusion.\n• Transparency: Clearly states if utilities trigger custom third-party SDK dependencies.",
    transparency: "We believe that Android application stores should never harvest user metadata, location logs, or bundle custom device telemetry. We do not inject telemetry code or background tracking pixels into our main app list, site, or layouts.\n\n1. Secure APK Mirroring: We mirror packages natively as authored by original developers — zero alterations, repackaging, or wrapper placements.\n\n2. Independent Integrity Checks: Every APK link is evaluated. Files hosting harmful trojans, dangerous trackers, or spyware are permanently banned.",
    clientNotes: "Install our portable web app companion directly on your Android device for instant notifications and faster download procedures.",
    clientApkUrl: "",
    clientApkSize: ""
  },
  dbSettings: {
    type: "Local Database File",
    host: "localhost",
    port: "3000",
    status: "Disconnected",
    databaseName: "rapidapks_local_production"
  },
  storageSettings: {
    activeType: "none",
    aws: {
      bucketName: "",
      region: "us-east-1",
      accessKeyId: "",
      secretAccessKey: "",
      folder: "apks"
    },
    r2: {
      accountId: "",
      bucketName: "",
      accessKeyId: "",
      secretAccessKey: "",
      customDomain: ""
    },
    digitalocean: {
      spaceName: "",
      region: "nyc3",
      accessKeyId: "",
      secretAccessKey: "",
      folder: "apks"
    },
    bucketbuzz: {
      bucketKey: "",
      secretToken: "",
      endpoint: "https://api.bucketbuzz.io"
    },
    telegram: {
      botToken: "",
      chatId: ""
    },
    ftp: {
      host: "",
      port: "21",
      username: "",
      password: "",
      folder: "/rapidapk",
      publicUrl: ""
    }
  },
  users: [
    { id: "usr1", name: "Admin", email: "admin@rapidapk.com", role: "SuperAdmin", status: "Active", password: "admin", username: "admin" }
  ]
};

// Always load state inside memory as well
export const getStoreState = (): AppStoreState => {
  const data = localStorage.getItem("rapidapk_dynamic_state_v4");
  if (!data) {
    localStorage.setItem("rapidapk_dynamic_state_v4", JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }
  try {
    const parsed = JSON.parse(data);
    // Deep fallback checks to avoid any undefined crash when user adds fields
    if (!parsed.siteSettings) parsed.siteSettings = { ...DEFAULT_STATE.siteSettings };
    if (!parsed.siteSettings.promoBanner) parsed.siteSettings.promoBanner = { ...DEFAULT_STATE.siteSettings.promoBanner };
    if (parsed.siteSettings.promoBanner.enabled === undefined) parsed.siteSettings.promoBanner.enabled = true;
    if (!parsed.siteSettings.adPlacements) parsed.siteSettings.adPlacements = { ...DEFAULT_STATE.siteSettings.adPlacements! };
    if (!parsed.siteSettings.customAds) parsed.siteSettings.customAds = [...DEFAULT_STATE.siteSettings.customAds];
    if (!parsed.socialLinks) parsed.socialLinks = { ...DEFAULT_STATE.socialLinks };
    if (!parsed.infoPages) parsed.infoPages = { ...DEFAULT_STATE.infoPages };
    if (!parsed.dbSettings) parsed.dbSettings = { ...DEFAULT_STATE.dbSettings };
    if (!parsed.storageSettings) parsed.storageSettings = { ...DEFAULT_STATE.storageSettings };
    if (!parsed.users) parsed.users = [...DEFAULT_STATE.users];
    if (!parsed.mustHaveCollections) parsed.mustHaveCollections = [...DEFAULT_STATE.mustHaveCollections];
    if (!parsed.headerTags) parsed.headerTags = [...DEFAULT_STATE.headerTags];
    if (!parsed.news) parsed.news = [...(DEFAULT_STATE.news || [])];
    
    // Filter out fake demo news manually if they exist from an older save
    if (parsed.news && Array.isArray(parsed.news)) {
      parsed.news = parsed.news.filter((n: any) => n.id !== "news_demo_1");
    }

    // Auto-enrich legacy or cached apps with real developer data from DEFAULT_STATE
    const categories: Array<"heroBanners" | "mmorpgApps" | "latestUpdates" | "newReleases" | "worldCupApps" | "topDownloads" | "paidForYou"> = [
      "heroBanners",
      "mmorpgApps",
      "latestUpdates",
      "newReleases",
      "worldCupApps",
      "topDownloads",
      "paidForYou"
    ];
    categories.forEach((catKey) => {
      if (!parsed[catKey]) {
        parsed[catKey] = [...(DEFAULT_STATE[catKey] as any[])];
      }
      const parsedList = parsed[catKey];
      const defaultList = DEFAULT_STATE[catKey] as any[];
      if (Array.isArray(parsedList) && Array.isArray(defaultList)) {
        if (parsedList.length === 0 && defaultList.length > 0) {
          parsed[catKey] = [...defaultList];
        } else {
          parsedList.forEach((parsedApp: any) => {
            const matchingDefault = defaultList.find((d: any) => d.id === parsedApp.id);
            if (matchingDefault) {
              if (!parsedApp.developerName || parsedApp.developerName === "AppStore Developer" || parsedApp.developerName === "rapidapk Developer") {
                parsedApp.developerName = matchingDefault.developerName;
              }
              if (!parsedApp.developer || parsedApp.developer === "AppStore Developer" || parsedApp.developer === "rapidapk Developer") {
                parsedApp.developer = matchingDefault.developer;
              }
            }
          });
        }
      }
    });

    return parsed;
  } catch (e) {
    return DEFAULT_STATE;
  }
};

export const saveStoreState = (state: AppStoreState) => {
  localStorage.setItem("rapidapk_dynamic_state_v4", JSON.stringify(state));
  syncState();
};

// Declaring mutable exported arrays so existing react components do not crash
const initialState = getStoreState();

export const headerTags: string[] = [...initialState.headerTags];
export const heroBanners: AppItem[] = [...initialState.heroBanners];
export const mmorpgApps: AppItem[] = [...initialState.mmorpgApps];
export const latestUpdates: AppItem[] = [...initialState.latestUpdates];
export const newReleases: AppItem[] = [...initialState.newReleases];
export const worldCupApps: AppItem[] = [...initialState.worldCupApps];
export const topDownloads: AppItem[] = [...initialState.topDownloads];
export const paidForYou: AppItem[] = [...initialState.paidForYou];

export const syncState = () => {
  const currentState = getStoreState();
  
  headerTags.length = 0;
  headerTags.push(...currentState.headerTags);
  
  heroBanners.length = 0;
  heroBanners.push(...currentState.heroBanners.filter(app => app.status !== 'pending'));
  
  mmorpgApps.length = 0;
  mmorpgApps.push(...currentState.mmorpgApps.filter(app => app.status !== 'pending'));
  
  latestUpdates.length = 0;
  latestUpdates.push(...currentState.latestUpdates.filter(app => app.status !== 'pending'));
  
  newReleases.length = 0;
  newReleases.push(...currentState.newReleases.filter(app => app.status !== 'pending'));
  
  worldCupApps.length = 0;
  worldCupApps.push(...currentState.worldCupApps.filter(app => app.status !== 'pending'));
  
  topDownloads.length = 0;
  topDownloads.push(...currentState.topDownloads.filter(app => app.status !== 'pending'));
  
  paidForYou.length = 0;
  paidForYou.push(...currentState.paidForYou.filter(app => app.status !== 'pending'));
};

export const getAllApps = (includePending = false): AppItem[] => {
  const state = getStoreState();
  // Ensure unique list by ID
  const mapArr = [
    ...(state.heroBanners || []),
    ...(state.mmorpgApps || []),
    ...(state.latestUpdates || []),
    ...(state.newReleases || []),
    ...(state.worldCupApps || []),
    ...(state.topDownloads || []),
    ...(state.paidForYou || [])
  ];
  const unique: AppItem[] = [];
  const seen = new Set<string>();
  for (const item of mapArr) {
    if (item && item.id && !seen.has(item.id)) {
      if (!includePending && item.status === 'pending') {
        continue;
      }
      seen.add(item.id);
      unique.push(item);
    }
  }
  return unique;
};

export const getAppById = (id: string): AppItem | undefined => {
  return getAllApps(true).find(app => app.id === id);
};

// ==========================================
// PRE-BUILT AUTHENTICATION SESSION SYSTEM
// ==========================================

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  username?: string;
  dob?: string;
  phone?: string;
}

export const getCurrentUser = (): UserSession | null => {
  const data = localStorage.getItem("appstore_current_user_session");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

export const setCurrentUser = (user: UserSession | null) => {
  if (user === null) {
    localStorage.removeItem("appstore_current_user_session");
  } else {
    localStorage.setItem("appstore_current_user_session", JSON.stringify(user));
  }
  // Notify components (e.g. TopBar header profile icon) that auth state has changed
  window.dispatchEvent(new Event("appstore_auth_update"));
};

export const registerUser = (
  name: string,
  email: string,
  password?: string,
  username?: string,
  dob?: string,
  phone?: string,
  role: string = "User"
): UserSession | string => {
  const state = getStoreState();
  const lowerEmail = email.toLowerCase().trim();
  
  if (state.users.some(u => u.email.toLowerCase() === lowerEmail)) {
    return "Email already registered!";
  }
  
  const newUser = {
    id: "usr_" + Date.now(),
    name: name.trim(),
    email: lowerEmail,
    role,
    status: "Active",
    password: password || "",
    username: username ? username.trim() : "",
    dob: dob || "",
    phone: phone || ""
  };
  
  state.users.push(newUser);
  saveStoreState(state);
  
  const session: UserSession = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status,
    username: newUser.username,
    dob: newUser.dob,
    phone: newUser.phone
  };
  
  setCurrentUser(session);
  return session;
};

export const loginUser = (email: string, password?: string): UserSession | string => {
  const state = getStoreState();
  const lowerEmail = email.toLowerCase().trim();
  const found = state.users.find(u => u.email.toLowerCase() === lowerEmail);
  
  if (!found) {
    return "Account not found with this email. Please Sign Up!";
  }
  
  if (found.password && password !== undefined && found.password !== password) {
    return "Incorrect password. Please try again!";
  }
  if (found.password && !password) {
    return "Incorrect password. Please try again!";
  }
  
  if (found.status === "Banned") {
    return "This user account has been banned by administrators.";
  }
  
  const session: UserSession = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    status: found.status,
    username: found.username,
    dob: found.dob,
    phone: found.phone
  };
  
  setCurrentUser(session);
  return session;
};

// Sync immediately on initial load
syncState();

export function getNumericDownloads(dStr: string = ""): number {
  if (!dStr) return 0;
  const clean = dStr.toLowerCase().replace(/[^0-9a-z.]/g, '');
  const val = parseFloat(clean) || 0;
  if (clean.includes('b')) return val * 1000000000;
  if (clean.includes('cr')) return val * 10000000;
  if (clean.includes('m')) return val * 1000000;
  if (clean.includes('l')) return val * 100000;
  if (clean.includes('k')) return val * 1000;
  return val;
}

export function formatPlayStoreDownloads(dStr: string | number = ""): string {
  let num = 0;
  if (typeof dStr === "number") {
    num = dStr;
  } else {
    const cleanStr = (dStr || "").trim().toLowerCase();
    if (cleanStr.includes('l') && !cleanStr.includes('l+')) {
      return (dStr || "").trim();
    }
    num = getNumericDownloads(dStr);
  }

  if (num <= 0) return "100+";
  if (num < 1000) {
    if (num < 100) return "100+";
    return `${Math.floor(num / 100) * 100}+`;
  }
  if (num < 100000) {
    const k = Math.floor(num / 1000);
    return `${k}k+`;
  }
  if (num < 10000000) {
    const l = Math.floor(num / 100000);
    return `${l}L+`;
  }
  const cr = Math.floor(num / 10000000);
  return `${cr}Cr+`;
}

export function isPremiumApp(app: AppItem | any): boolean {
  return false;
}

export const APP_CATEGORIES = [
  "Art & Design",
  "Auto & Vehicles",
  "Beauty",
  "Books & Reference",
  "Business",
  "Comics",
  "Communication",
  "Dating",
  "Education",
  "Emulator",
  "Entertainment",
  "Events",
  "Finance",
  "Food & Drink",
  "Health & Fitness",
  "House & Home",
  "Libraries & Demo",
  "Lifestyle",
  "Maps & Navigation",
  "Medical",
  "Music",
  "Music & Audio",
  "News & Magazines",
  "Parenting",
  "Personalization",
  "Photography",
  "Productivity",
  "Shopping",
  "Social",
  "Sport",
  "Tools",
  "Travel & Local",
  "Video Players & Editors",
  "Weather"
];

export const GAME_CATEGORIES = [
  "Action",
  "Adventure",
  "Arcade",
  "Board",
  "Card",
  "Casino",
  "Casual",
  "Educational",
  "Music",
  "NSFW",
  "Puzzle",
  "Racing",
  "Role Playing",
  "RPG",
  "Simulation",
  "Sports",
  "Strategy",
  "Trivia",
  "Word"
];

export function mapPlayStoreGenre(genreId: string, genreName: string): { category: "apps" | "games"; tag: string } {
  const gid = (genreId || "").toUpperCase();
  const gname = (genreName || "").trim();

  // Check if it's explicitly a game genre
  const isGame = gid.startsWith("GAME_") || 
                 ["GAME", "ARCADE", "ACTION", "ADVENTURE", "BOARD", "CARD", "CASINO", "CASUAL", "EDUCATIONAL", "MUSIC", "PUZZLE", "RACING", "ROLE_PLAYING", "SIMULATION", "SPORTS", "STRATEGY", "TRIVIA", "WORD"].some(kw => gid.includes(kw));

  if (isGame) {
    if (gid.includes("ACTION")) return { category: "games", tag: "Action" };
    if (gid.includes("ADVENTURE")) return { category: "games", tag: "Adventure" };
    if (gid.includes("ARCADE")) return { category: "games", tag: "Arcade" };
    if (gid.includes("BOARD")) return { category: "games", tag: "Board" };
    if (gid.includes("CARD")) return { category: "games", tag: "Card" };
    if (gid.includes("CASINO")) return { category: "games", tag: "Casino" };
    if (gid.includes("CASUAL")) return { category: "games", tag: "Casual" };
    if (gid.includes("EDUCATIONAL")) return { category: "games", tag: "Educational" };
    if (gid.includes("MUSIC")) return { category: "games", tag: "Music" };
    if (gid.includes("PUZZLE")) return { category: "games", tag: "Puzzle" };
    if (gid.includes("RACING")) return { category: "games", tag: "Racing" };
    if (gid.includes("ROLE_PLAYING") || gid.includes("ROLEPLAYING")) return { category: "games", tag: "Role Playing" };
    if (gid.includes("SIMULATION")) return { category: "games", tag: "Simulation" };
    if (gid.includes("SPORTS")) return { category: "games", tag: "Sports" };
    if (gid.includes("STRATEGY")) return { category: "games", tag: "Strategy" };
    if (gid.includes("TRIVIA")) return { category: "games", tag: "Trivia" };
    if (gid.includes("WORD")) return { category: "games", tag: "Word" };

    const lowerName = gname.toLowerCase();
    if (lowerName.includes("role")) return { category: "games", tag: "Role Playing" };
    if (lowerName.includes("rpg")) return { category: "games", tag: "RPG" };
    if (lowerName.includes("nsfw")) return { category: "games", tag: "NSFW" };

    return { category: "games", tag: "Action" };
  } else {
    if (gid.includes("ART_AND_DESIGN")) return { category: "apps", tag: "Art & Design" };
    if (gid.includes("AUTO_AND_VEHICLES")) return { category: "apps", tag: "Auto & Vehicles" };
    if (gid.includes("BEAUTY")) return { category: "apps", tag: "Beauty" };
    if (gid.includes("BOOKS_AND_REFERENCE")) return { category: "apps", tag: "Books & Reference" };
    if (gid.includes("BUSINESS")) return { category: "apps", tag: "Business" };
    if (gid.includes("COMICS")) return { category: "apps", tag: "Comics" };
    if (gid.includes("COMMUNICATION")) return { category: "apps", tag: "Communication" };
    if (gid.includes("DATING")) return { category: "apps", tag: "Dating" };
    if (gid.includes("EDUCATION")) return { category: "apps", tag: "Education" };
    if (gid.includes("ENTERTAINMENT")) return { category: "apps", tag: "Entertainment" };
    if (gid.includes("EVENTS")) return { category: "apps", tag: "Events" };
    if (gid.includes("FINANCE")) return { category: "apps", tag: "Finance" };
    if (gid.includes("FOOD_AND_DRINK")) return { category: "apps", tag: "Food & Drink" };
    if (gid.includes("HEALTH_AND_FITNESS")) return { category: "apps", tag: "Health & Fitness" };
    if (gid.includes("HOUSE_AND_HOME")) return { category: "apps", tag: "House & Home" };
    if (gid.includes("LIBRARIES_AND_DEMO")) return { category: "apps", tag: "Libraries & Demo" };
    if (gid.includes("LIFESTYLE")) return { category: "apps", tag: "Lifestyle" };
    if (gid.includes("MAPS_AND_NAVIGATION")) return { category: "apps", tag: "Maps & Navigation" };
    if (gid.includes("MEDICAL")) return { category: "apps", tag: "Medical" };
    if (gid.includes("MUSIC_AND_AUDIO")) return { category: "apps", tag: "Music & Audio" };
    if (gid.includes("NEWS_AND_MAGAZINES")) return { category: "apps", tag: "News & Magazines" };
    if (gid.includes("PARENTING")) return { category: "apps", tag: "Parenting" };
    if (gid.includes("PERSONALIZATION")) return { category: "apps", tag: "Personalization" };
    if (gid.includes("PHOTOGRAPHY")) return { category: "apps", tag: "Photography" };
    if (gid.includes("PRODUCTIVITY")) return { category: "apps", tag: "Productivity" };
    if (gid.includes("SHOPPING")) return { category: "apps", tag: "Shopping" };
    if (gid.includes("SOCIAL")) return { category: "apps", tag: "Social" };
    if (gid.includes("SPORTS")) return { category: "apps", tag: "Sport" };
    if (gid.includes("TOOLS")) return { category: "apps", tag: "Tools" };
    if (gid.includes("TRAVEL_AND_LOCAL")) return { category: "apps", tag: "Travel & Local" };
    if (gid.includes("VIDEO_PLAYERS")) return { category: "apps", tag: "Video Players & Editors" };
    if (gid.includes("WEATHER")) return { category: "apps", tag: "Weather" };

    const lowerName = gname.toLowerCase();
    if (lowerName.includes("art")) return { category: "apps", tag: "Art & Design" };
    if (lowerName.includes("auto")) return { category: "apps", tag: "Auto & Vehicles" };
    if (lowerName.includes("beauty")) return { category: "apps", tag: "Beauty" };
    if (lowerName.includes("book")) return { category: "apps", tag: "Books & Reference" };
    if (lowerName.includes("business")) return { category: "apps", tag: "Business" };
    if (lowerName.includes("comic")) return { category: "apps", tag: "Comics" };
    if (lowerName.includes("communicat")) return { category: "apps", tag: "Communication" };
    if (lowerName.includes("dating")) return { category: "apps", tag: "Dating" };
    if (lowerName.includes("educat")) return { category: "apps", tag: "Education" };
    if (lowerName.includes("entertain")) return { category: "apps", tag: "Entertainment" };
    if (lowerName.includes("finance")) return { category: "apps", tag: "Finance" };
    if (lowerName.includes("food") || lowerName.includes("drink")) return { category: "apps", tag: "Food & Drink" };
    if (lowerName.includes("health") || lowerName.includes("fit")) return { category: "apps", tag: "Health & Fitness" };
    if (lowerName.includes("house") || lowerName.includes("home")) return { category: "apps", tag: "House & Home" };
    if (lowerName.includes("lifestyle")) return { category: "apps", tag: "Lifestyle" };
    if (lowerName.includes("map") || lowerName.includes("navigat")) return { category: "apps", tag: "Maps & Navigation" };
    if (lowerName.includes("music") && lowerName.includes("audio")) return { category: "apps", tag: "Music & Audio" };
    if (lowerName.includes("music")) return { category: "apps", tag: "Music" };
    if (lowerName.includes("news")) return { category: "apps", tag: "News & Magazines" };
    if (lowerName.includes("parent")) return { category: "apps", tag: "Parenting" };
    if (lowerName.includes("personal")) return { category: "apps", tag: "Personalization" };
    if (lowerName.includes("photograph")) return { category: "apps", tag: "Photography" };
    if (lowerName.includes("productiv")) return { category: "apps", tag: "Productivity" };
    if (lowerName.includes("shop")) return { category: "apps", tag: "Shopping" };
    if (lowerName.includes("social")) return { category: "apps", tag: "Social" };
    if (lowerName.includes("sport")) return { category: "apps", tag: "Sport" };
    if (lowerName.includes("tool")) return { category: "apps", tag: "Tools" };
    if (lowerName.includes("travel")) return { category: "apps", tag: "Travel & Local" };
    if (lowerName.includes("video") || lowerName.includes("player") || lowerName.includes("editor")) return { category: "apps", tag: "Video Players & Editors" };
    if (lowerName.includes("weather")) return { category: "apps", tag: "Weather" };
    if (lowerName.includes("emulator")) return { category: "apps", tag: "Emulator" };

    return { category: "apps", tag: "Tools" };
  }
}
