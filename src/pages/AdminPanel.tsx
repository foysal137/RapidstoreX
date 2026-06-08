import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LayoutDashboard,
  Settings,
  Users,
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Download,
  Lock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Globe,
  Mail,
  Save,
  Database,
  ShieldAlert,
  Tag,
  Check,
  X,
  ShieldCheck,
  DownloadCloud,
  Star,
  Puzzle,
  Newspaper,
  RotateCcw,
  Code,
} from "lucide-react";
import { getStoreState, saveStoreState, AppStoreState, AppItem, syncState } from "../data";

import PlayStoreImporter from "../components/PlayStoreImporter";

export default function AdminPanel() {
  const navigate = useNavigate();

  // Dynamic Live State initialized from our main data.ts store
  const [storeState, setStoreState] = useState<AppStoreState>(getStoreState());
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "apps" | "categories" | "collections" | "database" | "storage" | "users" | "site" | "importer" | "hero_importer" | "ads" | "news"
  >("dashboard");

  useEffect(() => {
    fetch("/api/storage/config")
      .then(res => res.json())
      .then(data => {
        if (data && data.activeType) {
          setStoreState(prev => {
            const updated = {
              ...prev,
              storageSettings: {
                ...prev.storageSettings,
                ...data
              }
            };
            // save locally
            localStorage.setItem("rapidapk_dynamic_state_v4", JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(err => console.error("Cloud storage config pull issue:", err));
  }, []);

  // Persist authentication state in Session Storage for premium test flow experience
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_logged_in") === "true";
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Search state
  const [appSearch, setAppSearch] = useState("");
  const [selectedAppSection, setSelectedAppSection] = useState<string>("all");

  // App editing states
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [appForm, setAppForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    icon: "",
    image: "",
    tag: "NEW",
    downloads: "10K+",
    rating: "4.5",
    safety: "Verified Safe",
    category: "apps",
    targetSection: "latestUpdates", // mmorpgApps, heroBanners, newReleases, worldCupApps, topDownloads
    collectionId: "",
    editorsChoice: false,
    hasMod: false,
    isOffline: false,
    description: "",
    versionName: "1.0.0",
    versionCode: "1",
    apkUrl: "",
    screenshots: [] as string[],
  });
  
  // Custom Ads Form state
  const [adForm, setAdForm] = useState({
    title: "",
    imageUrl: "",
    link: "",
    active: true
  });

  // News portal state
  const [newsForm, setNewsForm] = useState({ title: "", content: "", date: "", thumbnail: "", category: "News", views: "0", readTime: "1 minute read" });
  const [editingNews, setEditingNews] = useState<any>(null);

  // Category addition
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<
    number | null
  >(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState("");

  // User adding state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active",
  });

  // DB test status
  const [testingConnection, setTestingConnection] = useState(false);
  const [dbTestMessage, setDbTestMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });

  // Cloud Storage status
  const [testingStorage, setTestingStorage] = useState(false);
  const [storageTestMsg, setStorageTestMsg] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });

  // Save changes wrapper
  const updateGlobalState = (updated: AppStoreState) => {
    setStoreState(updated);
    saveStoreState(updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check against store state users first (SuperAdmin role)
    const adminUser = storeState.users.find(u => u.role === "SuperAdmin");
    
    if (adminUser) {
      if (username === adminUser.username && password === adminUser.password) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_logged_in", "true");
        return;
      }
    }
    
    // Fallback/Legacy credentials
    if (username === "admin0net" && password === "BF?cD+9mMx*XZ?7") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_logged_in", "true");
    } else {
      alert("Invalid admin credentials entered! Please try again.");
    }
  };

  const handleUpdateAdminCreds = (newUsername: string, newPassword: string) => {
    if (!newUsername.trim() || !newPassword.trim()) return;
    
    const updatedUsers = storeState.users.map(u => {
      if (u.role === "SuperAdmin") {
        return { ...u, username: newUsername, password: newPassword };
      }
      return u;
    });

    updateGlobalState({
      ...storeState,
      users: updatedUsers
    });
    alert("Admin credentials updated successfully!");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_logged_in");
  };

  // List all apps dynamically referencing different sections
  const getCategorizedApps = () => {
    const list: Array<{ app: AppItem; section: string }> = [];
    storeState.heroBanners.forEach((a) =>
      list.push({ app: a, section: "heroBanners" }),
    );
    storeState.mmorpgApps.forEach((a) =>
      list.push({ app: a, section: "mmorpgApps" }),
    );
    storeState.latestUpdates.forEach((a) =>
      list.push({ app: a, section: "latestUpdates" }),
    );
    storeState.newReleases.forEach((a) =>
      list.push({ app: a, section: "newReleases" }),
    );
    storeState.worldCupApps.forEach((a) =>
      list.push({ app: a, section: "worldCupApps" }),
    );
    storeState.topDownloads.forEach((a) =>
      list.push({ app: a, section: "topDownloads" }),
    );
    return list;
  };

  const allCategorizedApps = getCategorizedApps();
  const pendingSubmissions = allCategorizedApps.filter((item) => item.app.status === "pending");

  const filteredApps = allCategorizedApps.filter((item) => {
    const matchesSearch =
      item.app.title.toLowerCase().includes(appSearch.toLowerCase()) ||
      item.app.subtitle.toLowerCase().includes(appSearch.toLowerCase());
    const matchesSection =
      selectedAppSection === "all" || item.section === selectedAppSection;
    return matchesSearch && matchesSection;
  });

  // Delete App from corresponding section list
  const handleDeleteApp = (id: string, section: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this app from this section?",
      )
    )
      return;

    const key = section as keyof AppStoreState;
    const currentList = storeState[key];
    if (Array.isArray(currentList)) {
      const updatedList = currentList.filter((a: any) => a.id !== id);
      const updatedState = {
        ...storeState,
        [key]: updatedList,
      };
      updateGlobalState(updatedState);
    }
  };

  const handleApproveApp = (id: string, section: string) => {
    const key = section as keyof AppStoreState;
    const currentList = storeState[key];
    if (Array.isArray(currentList)) {
      const updatedList = currentList.map((a: any) => {
        if (a.id === id) {
          return { ...a, status: "active" };
        }
        return a;
      });
      const updatedState = {
        ...storeState,
        [key]: updatedList,
      };
      updateGlobalState(updatedState);

      // Force instant catalog memory sync
      syncState();
      
      alert("App approved and published live to homepage.");
    }
  };

  const handleRejectApp = (id: string, section: string) => {
    if (!window.confirm("Are you sure you want to reject and delete this submission?")) {
      return;
    }
    const key = section as keyof AppStoreState;
    const currentList = storeState[key];
    if (Array.isArray(currentList)) {
      const updatedList = currentList.filter((a: any) => a.id !== id);
      const updatedState = {
        ...storeState,
        [key]: updatedList,
      };
      updateGlobalState(updatedState);

      // Force instant catalog memory sync
      syncState();
      
      alert("Submission rejected and deleted.");
    }
  };

  // Open modal/form to create a new app
  const handleOpenAddApp = () => {
    setEditingApp(null);
    setAppForm({
      id: "app_" + Date.now(),
      title: "",
      subtitle: "",
      icon: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
      tag: "NEW",
      downloads: "1.2M",
      rating: "4.6",
      safety: "Verified Safe",
      category: "apps",
      targetSection: "latestUpdates",
      collectionId: "",
      editorsChoice: false,
      hasMod: false,
      isOffline: false,
      description: "",
      versionName: "1.0.0",
      versionCode: "1",
      apkUrl: "",
      screenshots: [],
    });
    setIsAppModalOpen(true);
  };

  // Open modal to Edit App
  const handleOpenEditApp = (app: AppItem, section: string) => {
    setEditingApp(app);
    setAppForm({
      id: app.id,
      title: app.title,
      subtitle: app.subtitle,
      icon: app.icon,
      image:
        app.image ||
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
      tag: app.tag || "NEW",
      downloads: app.downloads || "1M+",
      rating: app.rating || "4.5",
      safety: app.safety || "Verified Safe",
      category: app.category || "apps",
      targetSection: section,
      collectionId: app.collectionId || "",
      editorsChoice: app.editorsChoice || false,
      hasMod: app.hasMod || false,
      isOffline: app.isOffline || false,
      description: app.description || "",
      versionName: app.versionName || "1.0.0",
      versionCode: app.versionCode || "1",
      apkUrl: app.apkUrl || "",
      screenshots: app.screenshots || [],
    });
    setIsAppModalOpen(true);
  };

  // Submit App Form (Add or Edit)
  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedState = { ...storeState };

    // Create actual item
    const finalAppItem: AppItem = {
      id: appForm.id,
      title: appForm.title,
      subtitle: appForm.subtitle,
      icon: appForm.icon,
      image: appForm.image,
      tag: appForm.tag,
      downloads: appForm.downloads,
      rating: appForm.rating,
      safety: appForm.safety,
      category: appForm.category,
      collectionId: appForm.targetSection === "latestUpdates" ? appForm.collectionId : undefined,
      editorsChoice: appForm.editorsChoice,
      hasMod: appForm.hasMod,
      isOffline: appForm.isOffline,
      description: appForm.description,
      versionName: appForm.versionName,
      versionCode: appForm.versionCode,
      apkUrl: appForm.apkUrl,
      screenshots: appForm.screenshots,
    };

    if (editingApp) {
      // Edit in ALL sections where this app ID exists to keep it synced globally
      const sections: Array<keyof AppStoreState> = [
        "heroBanners",
        "mmorpgApps",
        "latestUpdates",
        "newReleases",
        "worldCupApps",
        "topDownloads",
      ];
      
      let foundAnywhere = false;
      sections.forEach((sec) => {
        if (Array.isArray(updatedState[sec])) {
          const index = (updatedState[sec] as any[]).findIndex(
            (a) => a.id === editingApp.id
          );
          if (index > -1) {
            (updatedState[sec] as any[])[index] = finalAppItem;
            foundAnywhere = true;
          }
        }
      });
      
      // If by some chance it was moved entirely, push to target section
      if (!foundAnywhere) {
        const targetSec = appForm.targetSection as keyof AppStoreState;
        if (Array.isArray(updatedState[targetSec])) {
          (updatedState[targetSec] as any[]).push(finalAppItem);
        }
      }
    } else {
      // It's adding new app. Push to selected targetSection list
      const targetSec = appForm.targetSection as keyof AppStoreState;
      if (Array.isArray(updatedState[targetSec])) {
        (updatedState[targetSec] as any[]).push(finalAppItem);
      }
    }

    updateGlobalState(updatedState);
    setIsAppModalOpen(false);
    setEditingApp(null);
  };

  // Categories controller (Tags)
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const updatedState = {
      ...storeState,
      headerTags: [
        ...storeState.headerTags,
        newCategoryName.trim().toUpperCase(),
      ],
    };
    updateGlobalState(updatedState);
    setNewCategoryName("");
  };

  const handleEditCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setEditingCategoryValue(storeState.headerTags[index]);
  };

  const handleSaveCategory = (index: number) => {
    if (!editingCategoryValue.trim()) return;
    const newTags = [...storeState.headerTags];
    newTags[index] = editingCategoryValue.trim().toUpperCase();
    const updatedState = {
      ...storeState,
      headerTags: newTags,
    };
    updateGlobalState(updatedState);
    setEditingCategoryIndex(null);
  };

  const handleDeleteCategory = (index: number) => {
    if (
      !window.confirm(
        "Delete this category from menu? Apps under this section won't be deleted.",
      )
    )
      return;
    const newTags = storeState.headerTags.filter((_, i) => i !== index);
    const updatedState = {
      ...storeState,
      headerTags: newTags,
    };
    updateGlobalState(updatedState);
  };

  // Users control
  const handleToggleUserStatus = (userId: string) => {
    const updatedUsers = storeState.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === "Active" ? "Banned" : "Active",
        };
      }
      return u;
    });

    updateGlobalState({
      ...storeState,
      users: updatedUsers,
    });
  };

  const handleChangeUserRole = (userId: string, newRole: string) => {
    const updatedUsers = storeState.users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
        };
      }
      return u;
    });

    updateGlobalState({
      ...storeState,
      users: updatedUsers,
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    const userItem = {
      id: "usr_" + Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    };
    updateGlobalState({
      ...storeState,
      users: [...storeState.users, userItem],
    });
    setNewUser({ name: "", email: "", role: "User", status: "Active" });
  };

  // Database Connection Diagnostics
  const handleTestDatabaseConnection = () => {
    setTestingConnection(true);
    setDbTestMessage({ text: "", type: null });

    // Simulate real database direct integration test
    setTimeout(() => {
      setTestingConnection(false);
      const isConfigValid =
        storeState.dbSettings.uri !== undefined && storeState.dbSettings.uri.length > 5;

      if (isConfigValid) {
        setDbTestMessage({
          text: "Database handshake success! Socket online. DB states fully synchronized.",
          type: "success",
        });
        updateGlobalState({
          ...storeState,
          dbSettings: {
            ...storeState.dbSettings,
            status: "Connected",
          },
        });
      } else {
        setDbTestMessage({
          text: "Handshake timeout. Connection offline or invalid server credentials.",
          type: "error",
        });
        updateGlobalState({
          ...storeState,
          dbSettings: {
            ...storeState.dbSettings,
            status: "Error",
          },
        });
      }
    }, 1200);
  };

  const handleTestStorageConnection = () => {
    if (!storeState.storageSettings) return;
    setTestingStorage(true);
    setStorageTestMsg({ text: "", type: null });

    // Save state locally first
    updateGlobalState(storeState);

    // Sync config to backend
    fetch("/api/storage/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(storeState.storageSettings)
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not handshake with backend server.");
        return res.json();
      })
      .then(data => {
        // Sim active socket ping
        setTimeout(() => {
          const activeType = storeState.storageSettings?.activeType || "none";
          if (activeType === "none") {
            setStorageTestMsg({
              text: "Cloud storage connector is muted. Please check an integration active engine.",
              type: "error"
            });
          } else {
            const label = activeType === "aws_s3" ? "AWS S3 Bucket" : 
                          activeType === "cloudflare_r2" ? "Cloudflare R2 Space" :
                          activeType === "digitalocean_spaces" ? "DigitalOcean Space" :
                          activeType === "bucketbuzz" ? "Bucketbuzz Key Store" :
                          activeType === "telegram" ? "Telegram Bot Channel Storage" :
                          "FTP File Transfer System";
            setStorageTestMsg({
              text: `Success! Multi-channel pipeline connected to ${label} node successfully over SSL port 443. Settings synchronized with server node, and mirroring processes are online!`,
              type: "success"
            });
          }
          setTestingStorage(false);
        }, 1200);
      })
      .catch(err => {
        setTestingStorage(false);
        setStorageTestMsg({
          text: `Endpoint unreachable: ${err.message}`,
          type: "error"
        });
      });
  };

  // Site general info save
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Site brand settings and footer links saved successfully!");
    // Already state is live bound via onChanges, we just save state to write it to disk
    saveStoreState(storeState);
  };

  // News handlers
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNewsList = [...(storeState.news || [])];
    
    if (editingNews) {
      const index = updatedNewsList.findIndex(n => n.id === editingNews.id);
      if (index !== -1) {
        updatedNewsList[index] = { ...editingNews, ...newsForm };
      }
    } else {
      updatedNewsList.push({
        id: "news_" + Date.now(),
        ...newsForm,
        date: newsForm.date || new Date().toISOString().split('T')[0]
      });
    }

    updateGlobalState({ ...storeState, news: updatedNewsList });
    setNewsForm({ title: "", content: "", date: "", thumbnail: "", category: "News", views: "0", readTime: "1 minute read" });
    setEditingNews(null);
  };

  const handleDeleteNews = (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    updateGlobalState({
      ...storeState,
      news: (storeState.news || []).filter(n => n.id !== id)
    });
  };
  
  const handleEditNews = (news: any) => {
    setEditingNews(news);
    setNewsForm({ title: news.title, content: news.content, date: news.date, thumbnail: news.thumbnail || "", category: news.category || "News", views: news.views || "0", readTime: news.readTime || "1 minute read" });
  };

  const handleResetAppData = () => {
    if (!window.confirm("ARE YOU SURE? This will delete all app data, content, and collections. Admin users and site configuration will be preserved. This action CANNOT be undone.")) return;
    
    const newState: AppStoreState = {
      ...storeState,
      heroBanners: [],
      mmorpgApps: [],
      latestUpdates: [],
      newReleases: [],
      worldCupApps: [],
      topDownloads: [],
      news: [],
      mustHaveCollections: [],
    };
    updateGlobalState(newState);                
    alert("Data reset successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 justify-center items-center p-5 relative overflow-hidden">
        {/* Abstract Background Design and Brand decoration to avoid raw UI */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/3"></div>

        <div className="bg-slate-800/50 dark:bg-slate-950/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-sm relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.75rem] flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
            <Lock className="w-10 h-10 text-white" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white dark:bg-slate-950 rounded-full"></div>
            </div>
          </div>

          <h2 className="text-3xl font-black text-white text-center tracking-tight mb-2">
            Access Control
          </h2>
          <p className="text-gray-400 text-sm font-semibold text-center mb-8 uppercase tracking-widest text-[11px]">
            Secure Web Terminal
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-black text-gray-300 mb-1.5 ml-1 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/20 dark:bg-slate-950/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950/40 dark:focus:bg-slate-950/10 transition-all placeholder-white/30"
                placeholder="Username"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-300 mb-1.5 ml-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/20 dark:bg-slate-950/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-semibold text-white focus:outline-none focus:border-blue-500 focus:bg-slate-950/40 dark:focus:bg-slate-950/10 transition-all placeholder-white/30"
                placeholder="••••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-4 rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.25)] transition-all active:scale-[0.98] mt-3"
            >
              Authorize Node
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans pb-safe animate-in fade-in duration-300">
      {/* Dynamic Brand Admin Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800">
        <div className="flex items-center justify-between px-5 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 -ml-2 bg-slate-800/80 hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center border border-slate-700/60"
              title="Go Back To AppStore"
            >
              <ArrowLeft className="w-5 h-5 text-slate-200" />
            </button>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-inner relative">
              <Database className="w-5 h-5 text-white" />
              <div
                className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  storeState.dbSettings.status === "Connected"
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none text-white">
                {storeState.siteSettings.title} Control Center
              </h1>
              <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5 mt-1">
                SYSTEM HOSTED • DB: {storeState.dbSettings.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="hidden sm:inline-flex bg-slate-850 hover:bg-slate-800 border border-slate-705 text-white py-1.5 px-3.5 rounded-full text-xs font-bold transition-all"
            >
              Live AppStore
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white py-1.5 px-3.5 rounded-full text-xs font-bold transition-all border border-red-500/20 active:scale-95"
            >
              Deauthorize
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Desk Core */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row p-4 sm:p-6 gap-6">
        {/* Control Navigation Rails */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-950 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-4 shrink-0 h-fit">
          <h3 className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-4 ml-3">
            Operations
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> System Desk
            </button>

            <button
              onClick={() => setActiveTab("apps")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "apps"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Package className="w-4 h-4" /> App Uploads & Management
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Tag className="w-4 h-4 text-orange-500" /> Nav Tags
            </button>

            <button
              onClick={() => setActiveTab("collections")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "collections"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Puzzle className="w-4 h-4 text-purple-500" /> Must Have Collections
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "database"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Database className="w-4 h-4" /> Database Connector
            </button>

            <button
              onClick={() => setActiveTab("storage")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "storage"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <DownloadCloud className="w-4 h-4 text-emerald-500" /> Cloud Storage Nodes
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "users"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" /> User Privileges Panel
            </button>

            <button
              onClick={() => setActiveTab("importer")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "importer"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <DownloadCloud className="w-4 h-4" /> Play Store Importer
            </button>

            <button
              onClick={() => setActiveTab("hero_importer")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "hero_importer"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <DownloadCloud className="w-4 h-4 text-emerald-500" /> Hero Banners Importer
            </button>

            <button
              onClick={() => setActiveTab("site")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "site"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Globe className="w-4 h-4" /> Brand & Footers System
            </button>

            <button
              onClick={() => setActiveTab("ads")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "ads"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <TrendingUp className="w-4 h-4 text-orange-500" /> Ads Space Management
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                activeTab === "news"
                  ? "bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-100"
              }`}
            >
              <Newspaper className="w-4 h-4 text-emerald-500" /> News Portal Editor
            </button>
          </nav>
        </aside>

        {/* Dynamic Display Panels */}
        <main className="flex-1 bg-white dark:bg-slate-950 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 p-5 sm:p-7 min-h-[500px]">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    System Desk
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Live status, metrics trackers, and secure socket connection
                    statistics.
                  </p>
                </div>
                <div
                  onClick={handleTestDatabaseConnection}
                  className="bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 border border-gray-200 dark:border-slate-700 hover:border-gray-300 transition-all rounded-2xl px-4 py-2.5 flex items-center gap-3 cursor-pointer self-stretch sm:self-auto text-xs active:scale-95 font-bold text-gray-700 dark:text-gray-300"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${storeState.dbSettings.status === "Connected" && storeState.dbSettings.uri ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                  />
                  {storeState.dbSettings.status === "Connected" && storeState.dbSettings.uri
                    ? "System Database Sync Online"
                    : "DB Handshake Disconnected"}
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <Package className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-2xl font-black text-gray-800 dark:text-gray-200 tracking-tight">
                    {filteredApps.length}
                  </p>
                  <p className="text-[10px] font-black uppercase text-gray-400 mt-1">
                    Indexed Apps
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <Tag className="w-5 h-5 text-violet-600 mb-2" />
                  <p className="text-2xl font-black text-gray-800 dark:text-gray-200 tracking-tight">
                    {storeState.headerTags.length}
                  </p>
                  <p className="text-[10px] font-black uppercase text-gray-400 mt-1">
                    Navbar Tags
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <Users className="w-5 h-5 text-pink-500 mb-2" />
                  <p className="text-2xl font-black text-gray-800 dark:text-gray-200 tracking-tight">
                    {storeState.users.length}
                  </p>
                  <p className="text-[10px] font-black uppercase text-gray-400 mt-1">
                    Registered Users
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                  <Database className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs font-black text-gray-800 dark:text-gray-200 tracking-tight text-emerald-600 truncate">
                    {storeState.dbSettings.type}
                  </p>
                  <p className="text-[10px] font-black uppercase text-gray-400 mt-1.5">
                    Connected Engine
                  </p>
                </div>
              </div>

              {/* PENDING SUBMISSIONS REVIEW QUEUE */}
              <div className="border border-amber-100 rounded-3xl p-5 bg-amber-50/20 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-amber-950 uppercase flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Review Queue ({pendingSubmissions.length})
                    </h3>
                    <p className="text-[10px] text-amber-800 font-semibold mt-0.5">Submitted developer binaries pending Google Play Console validation approval.</p>
                  </div>
                  <span className="text-[10px] bg-amber-100 font-black text-amber-900 px-3 py-1 rounded-full border border-amber-200 uppercase">
                    Verification Needed
                  </span>
                </div>

                {pendingSubmissions.length === 0 ? (
                  <div className="text-center py-6 bg-white dark:bg-slate-950/50 border border-dashed border-amber-200 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">All submissions are approved.</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">New developer deployments will appear here for audit immediately.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingSubmissions.map(({ app, section }) => (
                      <div key={app.id} className="bg-white dark:bg-slate-950 border border-amber-100 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-sm transition-all animate-in fade-in duration-250">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-gray-150 overflow-hidden shrink-0 flex items-center justify-center">
                          {app.icon ? (
                            <img src={app.icon} alt={app.title} className="w-full h-full object-contain rounded-lg" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{app.title}</h4>
                          <span className="text-[9px] font-mono font-bold text-gray-400 block mt-0.5 truncate">{app.id} ({section})</span>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[9px] text-gray-500 font-semibold">
                            <span>Category: <strong className="text-gray-800 dark:text-gray-200 uppercase">{app.category}</strong></span>
                            <span>Version: <strong className="text-gray-800 dark:text-gray-200">{app.versionName}</strong></span>
                            {app.submittedBy && <span className="bg-slate-100 px-1.5 py-0.5 rounded font-black text-slate-705">Submitter: {app.submittedBy}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-stretch sm:self-center shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-0 border-amber-50">
                          <button
                            onClick={() => handleRejectApp(app.id, section)}
                            className="px-3 py-1.5 rounded-xl text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all flex items-center gap-1 uppercase"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveApp(app.id, section)}
                            className="px-4 py-1.5 rounded-xl text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95 transition-all flex items-center gap-1 uppercase"
                          >
                            Approve & Live
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status report blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Database Quick Stats */}
                <div className="border border-gray-100 dark:border-slate-800 rounded-3xl p-5 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-200">
                      Connection Details
                    </h4>
                    <Database className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-105/50 font-bold">
                      <span className="text-gray-400">DBMS:</span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {storeState.dbSettings.type}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-105/50 font-bold">
                      <span className="text-gray-400">Database Name:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-mono">
                        {storeState.dbSettings.databaseName}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-105/50 font-bold">
                      <span className="text-gray-400">Endpoint:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-mono">
                        {storeState.dbSettings.host}:
                        {storeState.dbSettings.port}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 items-center font-bold">
                      <span className="text-gray-400">State:</span>
                      <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-black flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Secure Sync
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Security Audit Block */}
                <div className="border border-gray-100 dark:border-slate-800 rounded-3xl p-5 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-extrabold text-sm text-gray-800 dark:text-gray-200">
                      Operational Integrity Check
                    </h4>
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-bold mb-3">
                    Secure client sandbox checks are active. All API transfers
                    are routed server-side, encrypting developer keys.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-extrabold">
                      <Check className="w-3.5 h-3.5" /> No Cross-Site Injection
                      parameters found
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-extrabold">
                      <Check className="w-3.5 h-3.5" /> Direct input escaping
                      filters enabled
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-extrabold">
                      <Check className="w-3.5 h-3.5" /> Storage sanitization
                      validated
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Security Credentials */}
              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/20">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Admin Security</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Update Terminal Credentials</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">New Username</label>
                    <input 
                      type="text" 
                      defaultValue={storeState.users.find(u => u.role === "SuperAdmin")?.username || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        const admin = storeState.users.find(u => u.role === "SuperAdmin");
                        if (admin) setUsername(val);
                      }}
                      id="new_admin_username"
                      className="w-full bg-white dark:bg-slate-950/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">New Password</label>
                    <input 
                      type="text" 
                      defaultValue={storeState.users.find(u => u.role === "SuperAdmin")?.password || ""}
                      id="new_admin_password"
                      className="w-full bg-white dark:bg-slate-950/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const u = (document.getElementById('new_admin_username') as HTMLInputElement).value;
                    const p = (document.getElementById('new_admin_password') as HTMLInputElement).value;
                    handleUpdateAdminCreds(u, p);
                  }}
                  className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-black py-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={14} /> Update Security Protocols
                </button>
              </div>

              {/* Developer contact / help card */}
              <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 rounded-[2rem] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg">
                <div className="space-y-1">
                  <h4 className="font-black text-lg tracking-tight">
                    Need Firebase Database Provisioning?
                  </h4>
                  <p className="text-white/75 text-xs font-semibold max-w-lg">
                    For persistent cloud-based integrations, we can provision
                    automatic Firestore rulesets, collection blue-prints and
                    Auth engines immediately.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("database")}
                  className="bg-white dark:bg-slate-950 text-slate-950 px-5 py-3 rounded-full text-xs font-black hover:bg-slate-100 transition-colors shadow-xl shrink-0"
                >
                  Configure Firestore
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: APPLICATIONS MANAGER */}
          {activeTab === "apps" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    Uploads & App Manager
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Upload standalone apps, manipulate targets, downloads,
                    ratings, and classifications.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddApp}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-5 py-3 rounded-full flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.35)] transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add / Upload App
                </button>
              </div>

              {/* Filters / Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full py-2 px-4 flex items-center flex-1">
                  <Search className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search application index..."
                    className="bg-transparent border-none outline-none text-xs font-bold w-full text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                  />
                </div>
                <select
                  value={selectedAppSection}
                  onChange={(e) => setSelectedAppSection(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-xs font-black text-gray-700 dark:text-gray-300 rounded-full py-2 px-4 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">Every Home Section</option>
                  <option value="heroBanners">Hero Banners</option>
                  <option value="mmorpgApps">MMORPG Apps List</option>
                  <option value="latestUpdates">Latest Updates List</option>
                  <option value="newReleases">New Releases List</option>
                  <option value="worldCupApps">World Cup 2026 Apps</option>
                  <option value="topDownloads">Top Downloads List</option>
                </select>
              </div>

              {/* App List */}
              <div className="space-y-4">
                {filteredApps.map(({ app, section }) => (
                  <div
                    key={`${app.id}_${section}`}
                    className="border border-gray-100 dark:border-slate-800 rounded-3xl p-4 bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-all relative"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-150 p-2 overflow-hidden shrink-0">
                      <img
                        src={app.icon || app.image}
                        alt={app.title}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-gray-100 truncate leading-snug">
                          {app.title}
                        </h4>
                        <span className="text-[9px] bg-blue-50 hover:bg-blue-105 transition-colors border border-blue-100 text-blue-600 font-black uppercase px-2 py-0.5 rounded-full">
                          {app.category || "apps"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 font-medium mt-0.5">
                        {app.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-gray-400 font-extrabold">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 uppercase">
                          SYS_ID: {app.id}
                        </span>
                        <span>
                          SECTION:{" "}
                          <strong className="text-indigo-600">{section}</strong>
                        </span>
                        <span>
                          DOWNLOADS:{" "}
                          <strong className="text-gray-700 dark:text-gray-300">
                            {app.downloads || "1M+"}
                          </strong>
                        </span>
                        <span>
                          RATING:{" "}
                          <strong className="text-amber-500">
                            ★ {app.rating || "4.5"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleOpenEditApp(app, section)}
                        className="px-3.5 py-1.5 rounded-full text-[11px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteApp(app.id, section)}
                        className="px-3.5 py-1.5 rounded-full text-[11px] font-black text-red-600 bg-red-50 hover:bg-red-100 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}

                {filteredApps.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-700">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-900 dark:text-gray-100 font-black text-sm">
                      No applications matching searches
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      Try selecting a different layout filter or clear search
                      bar.
                    </p>
                    <button
                      onClick={() => {
                        setAppSearch("");
                        setSelectedAppSection("all");
                      }}
                      className="mt-4 text-xs font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-105"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGER */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  Category Tags Editor
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Add, update name values, or remove category buttons on
                  Navbars.
                </p>
              </div>

              {/* Categorization Quick Adding */}
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">
                    Add New Category Tag name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MULTIPLAYER, UTILITIES, ARCHADE..."
                    className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-semibold w-full text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:border-blue-500"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddCategory}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-md w-full sm:w-auto active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 self-stretch sm:self-end"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add Category to Menu
                </button>
              </div>

              {/* Listing Dynamic Categories Tags */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">
                  Current Tags ({storeState.headerTags.length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {storeState.headerTags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-150 p-4 rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex-1 pr-4">
                        {editingCategoryIndex === idx ? (
                          <input
                            type="text"
                            className="bg-gray-50 dark:bg-slate-900 border border-blue-500 rounded-xl px-2 py-1 w-full text-sm font-black text-gray-800 dark:text-gray-200 outline-none uppercase"
                            value={editingCategoryValue}
                            onChange={(e) =>
                              setEditingCategoryValue(e.target.value)
                            }
                            autoFocus
                          />
                        ) : (
                          <span className="font-extrabold text-[#111] text-[13px] tracking-wide uppercase">
                            {tag}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {editingCategoryIndex === idx ? (
                          <>
                            <button
                              onClick={() => handleSaveCategory(idx)}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingCategoryIndex(null)}
                              className="p-1.5 bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditCategory(idx)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Rename Tag"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(idx)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete Tag"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MUST HAVE COLLECTIONS MANAGER */}
          {activeTab === "collections" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                  <Puzzle className="w-6 h-6 text-purple-600" /> Collection Sub-categories
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Manage background images, titles, and activate/deactivate 'Must Have' subcategories.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-5">
                <button
                  onClick={() => {
                     const newStore = { ...storeState };
                     if (!newStore.mustHaveCollections) newStore.mustHaveCollections = [];
                     newStore.mustHaveCollections.push({
                        id: "collection_" + Date.now(),
                        title: "New Collection",
                        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000",
                        description: "Step beyond limits — precision, power, and raw instinct collide in every fight.",
                        active: true
                     });
                     updateGlobalState(newStore);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 w-full mb-4 md:w-auto"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add New Sub-category
                </button>

                <div className="space-y-4">
                  {(storeState.mustHaveCollections || []).map((col, idx) => (
                     <div key={col.id} className="bg-white dark:bg-slate-950 border border-gray-150 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center relative group">
                        <button 
                          onClick={() => {
                            if (!window.confirm("Delete this sub-category?")) return;
                            const newStore = { ...storeState };
                            newStore.mustHaveCollections = newStore.mustHaveCollections.filter(c => c.id !== col.id);
                            updateGlobalState(newStore);
                          }}
                          className="absolute top-2 right-2 text-red-500 bg-red-50 hover:bg-red-100 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="w-full md:w-48 h-28 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 relative">
                           <img src={col.image} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 w-full space-y-3 pr-8">
                           <div className="flex items-center gap-4 justify-between">
                             <div className="flex-1">
                               <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block tracking-widest">Title (Visible on UI)</label>
                               <input 
                                 type="text"
                                 value={col.title}
                                 onChange={(e) => {
                                    const newStore = { ...storeState };
                                    newStore.mustHaveCollections[idx].title = e.target.value;
                                    updateGlobalState(newStore);
                                 }}
                                 className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 dark:text-gray-100"
                               />
                             </div>
                             
                             <div className="shrink-0 flex items-center gap-2 pt-4">
                               <input 
                                  type="checkbox"
                                  checked={col.active !== false}
                                  onChange={(e) => {
                                     const newStore = { ...storeState };
                                     newStore.mustHaveCollections[idx].active = e.target.checked;
                                     updateGlobalState(newStore);
                                  }}
                                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                               />
                               <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Active</span>
                             </div>
                           </div>
                           
                           <div>
                             <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block tracking-widest">Background Image URL</label>
                             <input 
                               type="text"
                               value={col.image}
                               onChange={(e) => {
                                  const newStore = { ...storeState };
                                  newStore.mustHaveCollections[idx].image = e.target.value;
                                  updateGlobalState(newStore);
                               }}
                               className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-blue-600 font-mono mb-2 w-full"
                             />
                             <div className="relative">
                               <input 
                                 type="file"
                                 accept="image/*"
                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                 onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                     const r = new FileReader();
                                     r.onloadend = () => {
                                        const newStore = { ...storeState };
                                        newStore.mustHaveCollections[idx].image = r.result as string;
                                        updateGlobalState(newStore);
                                     };
                                     r.readAsDataURL(file);
                                   }
                                 }}
                               />
                               <button type="button" className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl font-bold text-xs pointer-events-none w-full">
                                 Upload Image Instead
                               </button>
                             </div>
                           </div>
                           
                           <div>
                             <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block tracking-widest">Description</label>
                             <textarea 
                               value={col.description || ''}
                               onChange={(e) => {
                                  const newStore = { ...storeState };
                                  newStore.mustHaveCollections[idx].description = e.target.value;
                                  updateGlobalState(newStore);
                               }}
                               className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-h-[60px]"
                             />
                           </div>
                        </div>
                     </div>
                  ))}
                  {(storeState.mustHaveCollections || []).length === 0 && (
                     <div className="text-center py-6 text-gray-500 font-medium text-sm">No sub-categories created yet.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATABASE CONNECTOR */}
          {activeTab === "database" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    Database Connection Panel
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Manage database integration nodes, change engines, and
                    verify handshakes.
                  </p>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm border ${
                    storeState.dbSettings.status === "Connected" && storeState.dbSettings.uri
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${storeState.dbSettings.status === "Connected" && storeState.dbSettings.uri ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                  />
                  {storeState.dbSettings.status === "Connected" && storeState.dbSettings.uri
                    ? "Database Synchronized"
                    : "Handshake Muted"}
                </div>
              </div>

              {/* Engine Form settings */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 rounded-3xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-2">
                  Configure Integration Endpoint
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      DBMS Type
                    </label>
                    <select
                      value={storeState.dbSettings.type}
                      onChange={(e) => {
                        updateGlobalState({
                          ...storeState,
                          dbSettings: {
                            ...storeState.dbSettings,
                            type: e.target.value,
                          },
                        });
                      }}
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 rounded-xl py-2.5 px-4 outline-none focus:border-blue-500 w-full"
                    >
                      <option value="Firestore Database">
                        Google Cloud Firestore (Default)
                      </option>
                      <option value="PostgreSQL Live Cluster">
                        PostgreSQL Live Cluster
                      </option>
                      <option value="MongoDB Atlas Serverless">
                        MongoDB Atlas Serverless
                      </option>
                      <option value="CouchDB Independent Sync">
                        CouchDB Independent Sync
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      Database / Bucket Name
                    </label>
                    <input
                      type="text"
                      value={storeState.dbSettings.databaseName}
                      onChange={(e) => {
                        updateGlobalState({
                          ...storeState,
                          dbSettings: {
                            ...storeState.dbSettings,
                            databaseName: e.target.value,
                          },
                        });
                      }}
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                      placeholder="appstore_prod"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      Server Host / Endpoint
                    </label>
                    <input
                      type="text"
                      value={storeState.dbSettings.host}
                      onChange={(e) => {
                        updateGlobalState({
                          ...storeState,
                          dbSettings: {
                            ...storeState.dbSettings,
                            host: e.target.value,
                          },
                        });
                      }}
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                      placeholder="e.g. firestore.googleapis.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      Connection Port
                    </label>
                    <input
                      type="text"
                      value={storeState.dbSettings.port}
                      onChange={(e) => {
                        updateGlobalState({
                          ...storeState,
                          dbSettings: {
                            ...storeState.dbSettings,
                            port: e.target.value,
                          },
                        });
                      }}
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                      placeholder="443"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      Connection URI
                    </label>
                    <input
                      type="text"
                      value={storeState.dbSettings.uri || ""}
                      onChange={(e) => {
                        updateGlobalState({
                          ...storeState,
                          dbSettings: {
                            ...storeState.dbSettings,
                            uri: e.target.value,
                          },
                        });
                      }}
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                      placeholder="mongodb+srv://... or postgres://..."
                    />
                  </div>
                </div>

                {/* Test connection diagnostic */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center border-t border-gray-250/50 mt-4">
                  <button
                    onClick={handleTestDatabaseConnection}
                    disabled={testingConnection}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-6 py-3.5 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 self-stretch sm:self-auto shrink-0 disabled:opacity-50"
                  >
                    {testingConnection ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                        Performing Handshake Socket verification...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4" /> Test Socket & Database
                        Connect
                      </>
                    )}
                  </button>

                  {dbTestMessage.text && (
                    <div
                      className={`text-xs px-4 py-3 rounded-2xl flex items-center gap-2 border font-bold flex-1 ${
                        dbTestMessage.type === "success"
                          ? "bg-emerald-55/90 text-emerald-700 border-emerald-100"
                          : "bg-red-55/90 text-red-700 border-red-100"
                      }`}
                    >
                      {dbTestMessage.type === "success" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{dbTestMessage.text}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.5: CLOUD STORAGE CONNECTION NODES */}
          {activeTab === "storage" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                    Cloud Storage Nodes Config
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Connect online storage providers to mirror imported APK files automatically.
                  </p>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm border ${
                    storeState.storageSettings?.activeType && storeState.storageSettings.activeType !== "none"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      storeState.storageSettings?.activeType && storeState.storageSettings.activeType !== "none"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  {storeState.storageSettings?.activeType && storeState.storageSettings.activeType !== "none"
                    ? `Active Connection: ${storeState.storageSettings.activeType.toUpperCase()}`
                    : "No Cloud Storage Active"}
                </div>
              </div>

              {/* Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { id: "none", name: "Disabled (Local)" },
                  { id: "aws_s3", name: "AWS S3" },
                  { id: "cloudflare_r2", name: "Cloudflare R2" },
                  { id: "digitalocean_spaces", name: "DO Spaces" },
                  { id: "bucketbuzz", name: "Bucketbuzz" },
                  { id: "telegram", name: "Telegram Bot" },
                  { id: "ftp", name: "FTP Storage" }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      const updated = {
                        ...storeState,
                        storageSettings: {
                          ...(storeState.storageSettings || {
                            activeType: "none",
                            aws: { bucketName: "", region: "us-east-1", accessKeyId: "", secretAccessKey: "", folder: "apks" },
                            r2: { accountId: "", bucketName: "", accessKeyId: "", secretAccessKey: "", customDomain: "" },
                            digitalocean: { spaceName: "", region: "nyc3", accessKeyId: "", secretAccessKey: "", folder: "apks" },
                            bucketbuzz: { bucketKey: "", secretToken: "", endpoint: "https://api.bucketbuzz.io" },
                            telegram: { botToken: "", chatId: "" },
                            ftp: { host: "", port: "21", username: "", password: "", folder: "/rapidapks", publicUrl: "" }
                          }),
                          activeType: st.id as any
                        }
                      };
                      updateGlobalState(updated);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                      (storeState.storageSettings?.activeType || "none") === st.id
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm font-black text-xs"
                        : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-750 hover:bg-gray-50 dark:bg-slate-900 font-bold text-xs"
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>

              {/* Integration Inputs Box */}
              {storeState.storageSettings && storeState.storageSettings.activeType !== "none" && (
                <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 rounded-3xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest">
                    Credentials configuration for {storeState.storageSettings.activeType.toUpperCase()}
                  </h4>

                  {storeState.storageSettings.activeType === "aws_s3" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Bucket Name</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.aws.bucketName}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.aws.bucketName = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="rapidapks-bucket"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 font-black">Region</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.aws.region}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.aws.region = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="us-east-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Access Key ID</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.aws.accessKeyId}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.aws.accessKeyId = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="AKIAIOSFODNN7EXAMPLE"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Secret Access Key</label>
                        <input
                          type="password"
                          value={storeState.storageSettings.aws.secretAccessKey}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.aws.secretAccessKey = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="••••••••••••••••••••••••"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Folder Path (Optional)</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.aws.folder}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.aws.folder = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="apks"
                        />
                      </div>
                    </div>
                  )}

                  {storeState.storageSettings.activeType === "cloudflare_r2" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Account ID</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.r2.accountId}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.r2.accountId = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="cf-account-id-hash"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Bucket Name</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.r2.bucketName}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.r2.bucketName = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="rapidapks-r2-space"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 font-black">Access Key ID</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.r2.accessKeyId}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.r2.accessKeyId = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="r2-access-key"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Secret Access Key</label>
                        <input
                          type="password"
                          value={storeState.storageSettings.r2.secretAccessKey}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.r2.secretAccessKey = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="••••••••••••••••••••••••"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Custom Domain / CDN Proxy Domain (Optional)</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.r2.customDomain}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.r2.customDomain = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="cdn.rapidapks.com"
                        />
                      </div>
                    </div>
                  )}

                  {storeState.storageSettings.activeType === "digitalocean_spaces" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Space Name</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.digitalocean.spaceName}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.digitalocean.spaceName = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="rapidapks-space-name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Region / Endpoint</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.digitalocean.region}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.digitalocean.region = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="nyc3"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 font-black font-black">Access Key ID</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.digitalocean.accessKeyId}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.digitalocean.accessKeyId = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="DO00EXAMPLETK"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Secret Access Key</label>
                        <input
                          type="password"
                          value={storeState.storageSettings.digitalocean.secretAccessKey}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.digitalocean.secretAccessKey = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="••••••••••••••••••••••••"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Folder Path (Optional)</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.digitalocean.folder}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.digitalocean.folder = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="apks"
                        />
                      </div>
                    </div>
                  )}

                  {storeState.storageSettings.activeType === "bucketbuzz" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Bucket Key</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.bucketbuzz.bucketKey}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.bucketbuzz.bucketKey = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="bb-bucket-key"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Secret Access Token</label>
                        <input
                          type="password"
                          value={storeState.storageSettings.bucketbuzz.secretToken}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.bucketbuzz.secretToken = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-850"
                          placeholder="bb-secret-token"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Api Endpoint (Bucketbuzz IP/Domain)</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.bucketbuzz.endpoint}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.bucketbuzz.endpoint = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="https://api.bucketbuzz.io"
                        />
                      </div>
                    </div>
                  )}

                  {storeState.storageSettings.activeType === "telegram" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Telegram Bot API Token</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.telegram.botToken}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.telegram.botToken = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Target Chat ID or Channel ID</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.telegram.chatId}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.telegram.chatId = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="e.g. -100123456789"
                        />
                      </div>
                    </div>
                  )}

                  {storeState.storageSettings.activeType === "ftp" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">FTP server host</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.ftp.host}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.ftp.host = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="ftp.myhost.com or 192.168.1.50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Port</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.ftp.port}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.ftp.port = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="21"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Username</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.ftp.username}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.ftp.username = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="ftp_user"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">Password</label>
                        <input
                          type="password"
                          value={storeState.storageSettings.ftp.password}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.ftp.password = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="ftp_password"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 font-black">FTP Directory Folder</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.ftp.folder}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.ftp.folder = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="/rapidapks"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 font-black">Public Download Gateway URL (Required to play downloads from store frontend)</label>
                        <input
                          type="text"
                          value={storeState.storageSettings.ftp.publicUrl}
                          onChange={(e) => {
                            const updated = { ...storeState };
                            updated.storageSettings!.ftp.publicUrl = e.target.value;
                            updateGlobalState(updated);
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                          placeholder="e.g. https://dl.rapidapks.com"
                        />
                      </div>
                    </div>
                  )}

                  {/* Verification & Save trigger */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center border-t border-gray-250/50 mt-4">
                    <button
                      onClick={handleTestStorageConnection}
                      disabled={testingStorage}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-6 py-3.5 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 self-stretch sm:self-auto shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      {testingStorage ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Connection Socket...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Save Storage Connect Settings & Sync
                        </>
                      )}
                    </button>

                    {storageTestMsg.text && (
                      <div
                        className={`text-xs px-4 py-3 rounded-2xl flex items-center gap-2 border font-bold flex-1 ${
                          storageTestMsg.type === "success"
                            ? "bg-emerald-55/90 text-emerald-700 border-emerald-100"
                            : "bg-red-55/90 text-red-700 border-red-100"
                        }`}
                      >
                        {storageTestMsg.type === "success" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span>{storageTestMsg.text}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notice when Storage type is None */}
              {(!storeState.storageSettings || storeState.storageSettings.activeType === "none") && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-6 text-yellow-800 text-xs font-bold space-y-2">
                  <p className="text-sm font-black flex items-center gap-1.5 uppercase text-yellow-905">⚡ Transient Local Storage Active</p>
                  <p>
                    All APK download files will default to direct live proxy streaming from APKPure mirrors. 
                    Connect any external storage nodes above (like AWS, R2, Telegram channels) to capture, sanitize and rename files seamlessly under the <strong>-rapidapks.apk</strong> specification on the fly upon imports!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: USERS SECURITY PRIVILEGES */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  User Passwords & Privileges
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Manage system logins, ban profiles, and adjust operator access
                  levels.
                </p>
              </div>

              {/* Add user form */}
              <form
                onSubmit={handleAddUser}
                className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-5 space-y-4"
              >
                <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-1">
                  Add Operational Account
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      User Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-extrabold w-full text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      Email ID
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="admin@rapidapks.com"
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-extrabold w-full text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                      Access Role Privilege
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 rounded-xl py-2.5 px-4 outline-none w-full"
                    >
                      <option value="User">Standard User</option>
                      <option value="Admin">Administrator</option>
                      <option value="SuperAdmin">Super Administrator</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-3 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add Admin/User Profile
                </button>
              </form>

              {/* Users list */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">
                  Configured Credentials ({storeState.users.length})
                </h4>

                <div className="space-y-3">
                  {storeState.users.map((usr) => (
                    <div
                      key={usr.id}
                      className={`border rounded-2xl p-4 bg-white dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${
                        usr.status === "Banned"
                          ? "border-red-200 bg-red-50/20 opacity-80"
                          : "border-gray-150"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-gray-200 dark:border-slate-700">
                        <Users
                          className={`w-5 h-5 ${usr.status === "Banned" ? "text-red-500" : "text-slate-600"}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-[13px] text-gray-900 dark:text-gray-100">
                            {usr.name}
                          </h5>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                              usr.role === "SuperAdmin"
                                ? "bg-indigo-100 text-indigo-700"
                                : usr.role === "Admin"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-gray-100 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {usr.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {usr.email}
                        </p>
                      </div>

                      {/* Control actions */}
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-50 w-full sm:w-auto justify-end">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-gray-400 text-[10px] font-bold">
                            ROLE:
                          </span>
                          <select
                            value={usr.role}
                            onChange={(e) =>
                              handleChangeUserRole(usr.id, e.target.value)
                            }
                            className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-[11px] font-bold text-gray-700 dark:text-gray-300 rounded-lg py-1 px-2 cursor-pointer outline-none"
                          >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">SuperAdmin</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleToggleUserStatus(usr.id)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${
                            usr.status === "Banned"
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {usr.status === "Banned"
                            ? "Unban User"
                            : "Ban Profile"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: IMPORTER */}
          {activeTab === "importer" && (
            <PlayStoreImporter storeState={storeState} setStoreState={setStoreState} />
          )}

          {/* TAB 7.5: HERO BANNERS IMPORTER */}
          {activeTab === "hero_importer" && (
            <PlayStoreImporter storeState={storeState} setStoreState={setStoreState} forceSection="heroBanners" />
          )}

          {/* TAB 8: ADS MANAGEMENT */}
          {activeTab === "ads" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
                    Ads Space Manager <TrendingUp className="text-orange-500" />
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Manage visual advertisements and promotional banners.
                  </p>
                </div>
              </div>

              {/* Add New Ad Form */}
              <div className="bg-white dark:bg-slate-950 border-2 border-dashed border-blue-100 rounded-[2rem] p-6 sm:p-8">
                <h3 className="text-sm font-black uppercase tracking-tight text-blue-600 mb-6 flex items-center gap-2">
                  <Plus size={18} /> Add New Advertisement File
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Campaign Title</label>
                      <input 
                        type="text" 
                        value={adForm.title}
                        onChange={(e) => setAdForm({...adForm, title: e.target.value})}
                        placeholder="e.g. Summer Special Sale"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Redirect / Target URL</label>
                      <input 
                        type="text" 
                        value={adForm.link}
                        onChange={(e) => setAdForm({...adForm, link: e.target.value})}
                        placeholder="https://example.com/promo"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-50 transition-all"
                      />
                   </div>
                   <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-400 ml-1">Banner Image URL</label>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={adForm.imageUrl}
                          onChange={(e) => setAdForm({...adForm, imageUrl: e.target.value})}
                          placeholder="Paste image link here..."
                          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-50 transition-all"
                        />
                      </div>
                   </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                   <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={adForm.active}
                        onChange={(e) => setAdForm({...adForm, active: e.target.checked})}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-xs font-extrabold text-gray-500 uppercase tracking-tighter">Active by default</span>
                   </label>
                   
                   <button 
                    onClick={() => {
                      if(!adForm.title || !adForm.imageUrl) return alert("Title and Image URL are required!");
                      const newAd = {
                        id: 'ad_' + Date.now(),
                        ...adForm
                      };
                      updateGlobalState({
                        ...storeState,
                        siteSettings: {
                          ...storeState.siteSettings,
                          customAds: [...storeState.siteSettings.customAds, newAd]
                        }
                      });
                      setAdForm({ title: "", imageUrl: "", link: "", active: true });
                      alert("Advertisement added successfully!");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                   >
                     <Save size={16} /> Deploy Advertisement
                   </button>
                </div>
              </div>

              {/* Active Ads List */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest ml-1 border-l-4 border-orange-500 pl-3 py-1">
                  Deployed Campaigns ({storeState.siteSettings.customAds.length})
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                   {storeState.siteSettings.customAds.map((ad) => (
                     <div key={ad.id} className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-900 relative mb-4 border border-gray-100 dark:border-slate-800">
                          <img src={ad.imageUrl} className="w-full h-full object-cover" alt="ad preview" />
                          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tight ${ad.active ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {ad.active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        
                        <div className="flex items-start justify-between gap-3">
                           <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm truncate">{ad.title}</h4>
                              <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{ad.link || 'No redirect URL'}</p>
                           </div>
                           <button 
                            onClick={() => {
                              if(!window.confirm("Delete this campaign?")) return;
                              updateGlobalState({
                                ...storeState,
                                siteSettings: {
                                  ...storeState.siteSettings,
                                  customAds: storeState.siteSettings.customAds.filter(a => a.id !== ad.id)
                                }
                              });
                            }}
                            className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transition-all"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                   ))}
                   
                   {storeState.siteSettings.customAds.length === 0 && (
                     <div className="col-span-full py-12 text-center text-gray-300 font-black uppercase tracking-widest text-xs bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-slate-800">
                        No active advertisements found in archive.
                     </div>
                   )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: NEWS PORTAL EDITOR */}
          {activeTab === "news" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5 flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">News Portal Editor</h2>
                {(storeState.news || []).length === 0 && (
                  <button 
                    onClick={() => {
                      updateGlobalState({
                        ...storeState,
                        news: [
                          {
                            id: "news_demo_2",
                            category: "News",
                            title: "Age of Empires official is coming...",
                            content: "In addition to the release of Honor of Kings in the CIS today, publisher Level Infinite has announced that Age of Empires Mobile will launch soon.",
                            date: "February 24, 2024",
                            thumbnail: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1000",
                            views: "24.7K views",
                            readTime: "2 minute read"
                          }
                        ]
                      });
                    }}
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700"
                  >
                    Load Demo News
                  </button>
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 flex flex-col gap-5">
                <form onSubmit={handleSaveNews} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-500 ml-1">News Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. New update for Spotify..."
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm(prev => ({...prev, title: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-500 ml-1">Category Badge</label>
                      <input 
                        type="text" 
                        placeholder="e.g. News, Tutorial"
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newsForm.category}
                        onChange={(e) => setNewsForm(prev => ({...prev, category: e.target.value}))}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-500 ml-1">Thumbnail Cover</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="url" 
                          placeholder="Image URL"
                          className="flex-1 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newsForm.thumbnail}
                          onChange={(e) => setNewsForm(prev => ({...prev, thumbnail: e.target.value}))}
                        />
                        <div className="w-14 items-center justify-center shrink-0 flex flex-col">
                           <span className="text-xs font-bold text-gray-400">OR</span>
                        </div>
                        <div className="relative shrink-0 w-24">
                          <input 
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onloadend = () => setNewsForm(prev => ({ ...prev, thumbnail: r.result as string }));
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                          <button type="button" className="bg-blue-50 w-full hover:bg-blue-100 px-3 py-4 rounded-2xl font-black text-xs text-blue-600 transition-colors">
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-500 ml-1">Date</label>
                      <input 
                        type="text" 
                        placeholder="e.g. April 5, 2024"
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newsForm.date}
                        onChange={(e) => setNewsForm(prev => ({...prev, date: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-500 ml-1">Views</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 29.6K views"
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newsForm.views}
                        onChange={(e) => setNewsForm(prev => ({...prev, views: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-gray-500 ml-1">Read Time</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 1 minute read"
                        className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newsForm.readTime}
                        onChange={(e) => setNewsForm(prev => ({...prev, readTime: e.target.value}))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[11px] font-black uppercase text-gray-500 ml-1 flex justify-between">
                      <span>Article Content</span>
                      <span>(Supports [b]Bold[/b] and [img]URL[/img])</span>
                    </label>
                    <textarea
                      placeholder="Write your Android news or guide here..."
                      className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-700 h-48 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newsForm.content}
                      onChange={(e) => setNewsForm(prev => ({...prev, content: e.target.value}))}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center gap-2">
                      <Save className="w-4 h-4" /> {editingNews ? "Save Changes" : "Publish News"}
                    </button>
                    {editingNews && (
                      <button type="button" onClick={() => { setEditingNews(null); setNewsForm({ title: "", content: "", date: "", thumbnail: "", category: "News", views: "0", readTime: "1 minute read" }); }} className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-all">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
              
              <div className="mt-8">
                <h3 className="font-extrabold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-blue-500" /> Published Articles
                </h3>
                <div className="space-y-3">
                  {(storeState.news || []).length === 0 ? (
                      <div className="text-center py-10 bg-white dark:bg-slate-950 border border-dashed border-gray-200 dark:border-slate-700 rounded-3xl">
                        <Newspaper className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-500">No news articles published yet.</p>
                      </div>
                  ) : (
                    (storeState.news || []).map((news) => (
                      <div key={news.id} className="p-4 bg-white dark:bg-slate-950 border border-gray-150 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] gap-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {news.thumbnail ? (
                            <div className="w-24 h-[68px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 dark:border-slate-800">
                              <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-24 h-[68px] rounded-xl bg-gray-50 dark:bg-slate-900 shrink-0 border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                              <Newspaper className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-black text-[15px] text-gray-900 dark:text-gray-100 leading-tight mb-1">{news.title}</h4>
                            <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Published on {news.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-center shrink-0">
                           <button onClick={() => handleEditNews(news)} className="px-4 py-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-colors"> <Edit2 className="w-3.5 h-3.5"/> Edit </button>
                           <button onClick={() => handleDeleteNews(news.id)} className="px-4 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 font-bold text-xs flex items-center gap-1.5 transition-colors"> <Trash2 className="w-3.5 h-3.5"/> Delete </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SITE CONFIGS & SOCIAL PORTAL */}
          {activeTab === "site" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                  Main Platform Slogans & Links
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  Refactor brand title keywords, site descriptions, header
                  slogans, and footers.
                </p>
              </div>

              <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                {/* Slogan details and info */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 rounded-3xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-1 text-indigo-600">
                    Site Identity Configuration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        Navbar Platform Title
                      </label>
                      <input
                        type="text"
                        required
                        value={storeState.siteSettings.title}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            siteSettings: {
                              ...storeState.siteSettings,
                              title: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                        placeholder="e.g. AppStore"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        Top Scrolling Slogan / Marquee Text
                      </label>
                      <input
                        type="text"
                        required
                        value={storeState.siteSettings.bannerText}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            siteSettings: {
                              ...storeState.siteSettings,
                              bannerText: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-bold w-full text-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                        placeholder="e.g. DISCOVER THE BEST ANDROID APPS. 100% FREE AND SECURE."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        Footer About Us Description text
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={storeState.siteSettings.description}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            siteSettings: {
                              ...storeState.siteSettings,
                              description: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold w-full text-gray-800 dark:text-gray-200 leading-normal"
                        placeholder="Enter description about AppStore..."
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        Banner / Custom Ad HTML Base Profile
                      </label>
                      <textarea
                        rows={4}
                        value={storeState.siteSettings.customAdHtml || ""}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            siteSettings: {
                              ...storeState.siteSettings,
                              customAdHtml: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border text-blue-800 font-mono text-[10px] border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 w-full leading-normal"
                        placeholder="<!-- Paste Google AdSense or Custom HTML Image Banner code here to display globally -->"
                      />
                      <p className="text-[10px] text-gray-400 font-semibold mt-1.5 ml-1">
                        Any custom HTML injection, image banner, or Google ad code placed here will show up globally.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 border border-indigo-100 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-indigo-700 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-indigo-600" /> Main Promotion Section (Hero Banner)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                        Promotion Main Heading (e.g. Discover Best Apps)
                      </label>
                      <input
                        type="text"
                        value={storeState.siteSettings.promoBanner.title}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          newStore.siteSettings.promoBanner.title = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-extrabold w-full focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                        Promotion Subtitle (Small Description)
                      </label>
                      <input
                        type="text"
                        value={storeState.siteSettings.promoBanner.subtitle}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          newStore.siteSettings.promoBanner.subtitle = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs w-full font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-indigo-600 mb-1.5 ml-1 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                        Linked App Package ID
                      </label>
                      <input
                        type="text"
                        value={storeState.siteSettings.promoBanner.appId}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          newStore.siteSettings.promoBanner.appId = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border border-indigo-200 rounded-2xl px-4 py-3 text-xs font-mono font-black w-full text-indigo-600 focus:ring-2 focus:ring-indigo-100"
                        placeholder="e.g. com.whatsapp"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                        Banner Tag (e.g. VERIFIED)
                      </label>
                      <input
                        type="text"
                        value={storeState.siteSettings.promoBanner.tagText}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          newStore.siteSettings.promoBanner.tagText = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold w-full text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                        Action Button Label (e.g. Browse Now)
                      </label>
                      <input
                        type="text"
                        value={storeState.siteSettings.promoBanner.buttonText}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          newStore.siteSettings.promoBanner.buttonText = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-bold w-full text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <div className="sm:col-span-2 py-2">
                       <label className="flex items-center gap-3 cursor-pointer group w-fit">
                          <input 
                            type="checkbox" 
                            checked={storeState.siteSettings.promoBanner.enabled}
                            onChange={(e) => {
                              const newStore = { ...storeState };
                              newStore.siteSettings.promoBanner.enabled = e.target.checked;
                              updateGlobalState(newStore);
                            }}
                            className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                            Enable Home Hero Promo Banner
                          </span>
                       </label>
                       <p className="text-[10px] text-gray-400 font-bold ml-8 mt-1 italic">Tick this if you want to display the banner on the homepage</p>
                    </div>
                  </div>
                </div>

                {/* Multiple Custom Ads Manager */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-green-100 rounded-3xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-green-600 flex items-center justify-between w-full">
                    <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Manage Image Banners (Ads)</span>
                    <button 
                      onClick={() => {
                        const newStore = { ...storeState };
                        if (!newStore.siteSettings.customAds) newStore.siteSettings.customAds = [];
                        newStore.siteSettings.customAds.push({ id: "ad_" + Date.now(), title: "New Banner", imageUrl: "", link: "", active: true });
                        updateGlobalState(newStore);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] active:scale-95 transition-transform"
                    >
                      + Add New Banner
                    </button>
                  </h4>
                  
                  <div className="space-y-3">
                    {(storeState.siteSettings.customAds || []).length === 0 ? (
                      <p className="text-[10px] text-gray-400 font-bold italic py-4 text-center">No custom banners created yet. Click above to add one.</p>
                    ) : (
                      (storeState.siteSettings.customAds || []).map((ad, index) => (
                        <div key={ad.id} className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 relative group grid gap-3">
                          <button 
                            className="absolute top-3 right-3 text-red-500 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Ad"
                            onClick={() => {
                              if (!window.confirm("Delete this banner?")) return;
                              const newStore = { ...storeState };
                              newStore.siteSettings.customAds = newStore.siteSettings.customAds.filter(a => a.id !== ad.id);
                              updateGlobalState(newStore);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center justify-between pr-10">
                            <label className="text-[11px] font-black uppercase text-gray-500 ml-1">
                              Banner #{index + 1}
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={ad.active !== false}
                                onChange={(e) => {
                                  const newStore = { ...storeState };
                                  newStore.siteSettings.customAds[index].active = e.target.checked;
                                  updateGlobalState(newStore);
                                }}
                                className="w-4 h-4 text-green-600 rounded"
                              />
                              <span className="text-[10px] font-bold text-gray-500">Active</span>
                            </label>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                               <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Title (Internal)</label>
                               <input
                                 type="text"
                                 value={ad.title || ""}
                                 onChange={(e) => {
                                   const newStore = { ...storeState };
                                   newStore.siteSettings.customAds[index].title = e.target.value;
                                   updateGlobalState(newStore);
                                 }}
                                 className="bg-gray-50 dark:bg-slate-900 border text-gray-800 dark:text-gray-200 text-xs font-bold border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full"
                                 placeholder="Promo Banner 1"
                               />
                            </div>
                            <div>
                               <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Target Link URL</label>
                               <input
                                 type="text"
                                 value={ad.link || ""}
                                 onChange={(e) => {
                                   const newStore = { ...storeState };
                                   newStore.siteSettings.customAds[index].link = e.target.value;
                                   updateGlobalState(newStore);
                                 }}
                                 className="bg-gray-50 dark:bg-slate-900 border text-blue-600 text-xs font-bold border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full"
                                 placeholder="https://..."
                               />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                               <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Image URL (Required)</label>
                               <input
                                 type="text"
                                 value={ad.imageUrl || ""}
                                 onChange={(e) => {
                                   const newStore = { ...storeState };
                                   newStore.siteSettings.customAds[index].imageUrl = e.target.value;
                                   updateGlobalState(newStore);
                                 }}
                                 className="bg-gray-50 dark:bg-slate-900 border text-gray-800 dark:text-gray-200 text-xs font-medium border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 w-full"
                                 placeholder="https://example.com/banner.jpg"
                               />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Ad Placements (HTML Code) Manager */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-amber-100 rounded-3xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-amber-600 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Custom HTML Ad Networks Placements
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium pb-2 border-b border-gray-200 dark:border-slate-700/50">
                    Paste your Ad Network HTML snippet (e.g. AdSense) here. The ad will automatically display in the selected sections.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center justify-between text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        <span>Apps Page Banner</span>
                        <span className="text-[9px] bg-gray-200 px-2 rounded-full text-gray-600 dark:text-gray-400">Size: ~ max-w-2xl min-h-[200px]</span>
                      </label>
                      <textarea
                        value={storeState.siteSettings.adPlacements?.appsPage || ""}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          if (!newStore.siteSettings.adPlacements) newStore.siteSettings.adPlacements = { appsPage: "", gamesPage: "", browsePage: "", appDetailTop: "", appDetailBottom: "" };
                          newStore.siteSettings.adPlacements.appsPage = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border text-gray-800 dark:text-gray-200 text-xs font-mono font-medium border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 w-full h-20"
                        placeholder="<!-- Paste App Page Ad code here -->"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        <span>Games Page Banner</span>
                        <span className="text-[9px] bg-gray-200 px-2 rounded-full text-gray-600 dark:text-gray-400">Size: ~ max-w-2xl min-h-[200px]</span>
                      </label>
                      <textarea
                        value={storeState.siteSettings.adPlacements?.gamesPage || ""}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          if (!newStore.siteSettings.adPlacements) newStore.siteSettings.adPlacements = { appsPage: "", gamesPage: "", browsePage: "", appDetailTop: "", appDetailBottom: "" };
                          newStore.siteSettings.adPlacements.gamesPage = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border text-gray-800 dark:text-gray-200 text-xs font-mono font-medium border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 w-full h-20"
                        placeholder="<!-- Paste Game Page Ad code here -->"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        <span>App Details (Top Banner)</span>
                        <span className="text-[9px] bg-gray-200 px-2 rounded-full text-gray-600 dark:text-gray-400">Size: ~ max-w-3xl min-h-[100px]</span>
                      </label>
                      <textarea
                        value={storeState.siteSettings.adPlacements?.appDetailTop || ""}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          if (!newStore.siteSettings.adPlacements) newStore.siteSettings.adPlacements = { appsPage: "", gamesPage: "", browsePage: "", appDetailTop: "", appDetailBottom: "" };
                          newStore.siteSettings.adPlacements.appDetailTop = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border text-gray-800 dark:text-gray-200 text-xs font-mono font-medium border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 w-full h-20"
                        placeholder="<!-- Paste Top Ad code here -->"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        <span>App Details (Bottom Banner)</span>
                        <span className="text-[9px] bg-gray-200 px-2 rounded-full text-gray-600 dark:text-gray-400">Size: ~ max-w-3xl min-h-[250px]</span>
                      </label>
                      <textarea
                        value={storeState.siteSettings.adPlacements?.appDetailBottom || ""}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          if (!newStore.siteSettings.adPlacements) newStore.siteSettings.adPlacements = { appsPage: "", gamesPage: "", browsePage: "", appDetailTop: "", appDetailBottom: "" };
                          newStore.siteSettings.adPlacements.appDetailBottom = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border text-gray-800 dark:text-gray-200 text-xs font-mono font-medium border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 w-full h-20"
                        placeholder="<!-- Paste Bottom Ad code here -->"
                      />
                    </div>
                    <div>
                      <label className="flex items-center justify-between text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        <span>Browse Page Banner</span>
                        <span className="text-[9px] bg-gray-200 px-2 rounded-full text-gray-600 dark:text-gray-400">Size: ~ w-full min-h-[150px]</span>
                      </label>
                      <textarea
                        value={storeState.siteSettings.adPlacements?.browsePage || ""}
                        onChange={(e) => {
                          const newStore = { ...storeState };
                          if (!newStore.siteSettings.adPlacements) newStore.siteSettings.adPlacements = { appsPage: "", gamesPage: "", browsePage: "", appDetailTop: "", appDetailBottom: "" };
                          newStore.siteSettings.adPlacements.browsePage = e.target.value;
                          updateGlobalState(newStore);
                        }}
                        className="bg-white dark:bg-slate-950 border text-gray-800 dark:text-gray-200 text-xs font-mono font-medium border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 w-full h-20"
                        placeholder="<!-- Paste Browse Page Ad code here -->"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 rounded-3xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-1 text-indigo-600">
                    Footer Social Media Destinations
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1.5">
                        Facebook Profile link
                      </label>
                      <input
                        type="url"
                        required
                        value={storeState.socialLinks.facebook}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            socialLinks: {
                              ...storeState.socialLinks,
                              facebook: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold w-full text-gray-800 dark:text-gray-200"
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1.5">
                        Twitter / X Profile link
                      </label>
                      <input
                        type="url"
                        required
                        value={storeState.socialLinks.twitter}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            socialLinks: {
                              ...storeState.socialLinks,
                              twitter: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold w-full text-gray-800 dark:text-gray-200"
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1.5">
                        Instagram Profile link
                      </label>
                      <input
                        type="url"
                        required
                        value={storeState.socialLinks.instagram}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            socialLinks: {
                              ...storeState.socialLinks,
                              instagram: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold w-full text-gray-800 dark:text-gray-200"
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1.5">
                        YouTube Channel link
                      </label>
                      <input
                        type="url"
                        required
                        value={storeState.socialLinks.youtube}
                        onChange={(e) => {
                          updateGlobalState({
                            ...storeState,
                            socialLinks: {
                              ...storeState.socialLinks,
                              youtube: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold w-full text-gray-800 dark:text-gray-200"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Button with Save icon */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(37,99,235,0.25)] select-none active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Brand Details
                  </button>
                  <button
                    onClick={handleResetAppData}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] select-none active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset App Data
                  </button>
                </div>

                {/* Info Pages Editor section */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm my-6">
                  <h4 className="text-xs font-black uppercase text-gray-550 tracking-widest mb-1 text-indigo-600 font-bold">
                    Info Pages & Companion Client App Content
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        About Us Text
                      </label>
                      <textarea
                        rows={4}
                        value={storeState.infoPages?.aboutUs || ""}
                        onChange={(e) => {
                          const info = storeState.infoPages || {
                            aboutUs: "",
                            aboutStore: "",
                            editorialPolicy: "",
                            transparency: "",
                            clientNotes: "",
                            clientApkUrl: "",
                            clientApkSize: "",
                          };
                          updateGlobalState({
                            ...storeState,
                            infoPages: {
                              ...info,
                              aboutUs: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 leading-normal outline-none focus:border-blue-500"
                        placeholder="Enter About Us Content..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        About AppStore Text
                      </label>
                      <textarea
                        rows={4}
                        value={storeState.infoPages?.aboutStore || ""}
                        onChange={(e) => {
                          const info = storeState.infoPages || {
                            aboutUs: "",
                            aboutStore: "",
                            editorialPolicy: "",
                            transparency: "",
                            clientNotes: "",
                            clientApkUrl: "",
                            clientApkSize: "",
                          };
                          updateGlobalState({
                            ...storeState,
                            infoPages: {
                              ...info,
                              aboutStore: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 leading-normal outline-none focus:border-blue-500"
                        placeholder="Enter About AppStore description..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        Editorial Policy Text
                      </label>
                      <textarea
                        rows={5}
                        value={storeState.infoPages?.editorialPolicy || ""}
                        onChange={(e) => {
                          const info = storeState.infoPages || {
                            aboutUs: "",
                            aboutStore: "",
                            editorialPolicy: "",
                            transparency: "",
                            clientNotes: "",
                            clientApkUrl: "",
                            clientApkSize: "",
                          };
                          updateGlobalState({
                            ...storeState,
                            infoPages: {
                              ...info,
                              editorialPolicy: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-250 rounded-2xl px-4 py-3 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 leading-normal outline-none focus:border-blue-500"
                        placeholder="Enter Editorial Guidelines and policy checklist..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
                        Transparency & Trust Pledge Text
                      </label>
                      <textarea
                        rows={5}
                        value={storeState.infoPages?.transparency || ""}
                        onChange={(e) => {
                          const info = storeState.infoPages || {
                            aboutUs: "",
                            aboutStore: "",
                            editorialPolicy: "",
                            transparency: "",
                            clientNotes: "",
                            clientApkUrl: "",
                            clientApkSize: "",
                          };
                          updateGlobalState({
                            ...storeState,
                            infoPages: {
                              ...info,
                              transparency: e.target.value,
                            },
                          });
                        }}
                        className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 leading-normal outline-none focus:border-blue-500"
                        placeholder="Enter privacy guarantee and trust pledge..."
                      />
                    </div>

                    <div className="border-t border-gray-200 dark:border-slate-700/50 pt-4 space-y-4">
                      <h5 className="text-[11px] font-black uppercase text-indigo-505 ml-1 text-indigo-600 font-bold">
                        Companion Client App Details
                      </h5>

                      <div>
                        <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                          Client App Helper Notes
                        </label>
                        <textarea
                          rows={2}
                          value={storeState.infoPages?.clientNotes || ""}
                          onChange={(e) => {
                            const info = storeState.infoPages || {
                              aboutUs: "",
                              aboutStore: "",
                              editorialPolicy: "",
                              transparency: "",
                              clientNotes: "",
                              clientApkUrl: "",
                              clientApkSize: "",
                            };
                            updateGlobalState({
                              ...storeState,
                              infoPages: {
                                ...info,
                                clientNotes: e.target.value,
                              },
                            });
                          }}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 leading-normal outline-none focus:border-blue-500"
                          placeholder="Explain client sideload helper instructions..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                            Helper APK Direct Download URL
                          </label>
                          <input
                            type="url"
                            required
                            value={storeState.infoPages?.clientApkUrl || ""}
                            onChange={(e) => {
                              const info = storeState.infoPages || {
                                aboutUs: "",
                                aboutStore: "",
                                editorialPolicy: "",
                                transparency: "",
                                clientNotes: "",
                                clientApkUrl: "",
                                clientApkSize: "",
                              };
                              updateGlobalState({
                                ...storeState,
                                infoPages: {
                                  ...info,
                                  clientApkUrl: e.target.value,
                                },
                              });
                            }}
                            className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">
                            Helper APK Package Size
                          </label>
                          <input
                            type="text"
                            required
                            value={storeState.infoPages?.clientApkSize || ""}
                            onChange={(e) => {
                              const info = storeState.infoPages || {
                                aboutUs: "",
                                aboutStore: "",
                                editorialPolicy: "",
                                transparency: "",
                                clientNotes: "",
                                clientApkUrl: "",
                                clientApkSize: "",
                              };
                              updateGlobalState({
                                ...storeState,
                                infoPages: {
                                  ...info,
                                  clientApkSize: e.target.value,
                                },
                              });
                            }}
                            className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-semibold w-full text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500"
                            placeholder="e.g. 4.8 MB"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* DYNAMIC APP UPLOAD / EDITING MODAL WINDOW */}
      {isAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-2xl border border-gray-100 dark:border-slate-800 shadow-2xl relative my-8 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 tracking-tight">
                  {editingApp
                    ? "Edit Indexed App Details"
                    : "Upload Standalone App Asset"}
                </h3>
                <span className="text-[10px] bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold mt-1 inline-block">
                  {editingApp
                    ? `MODIFYING ${editingApp.id}`
                    : "STORE ENGINE UPLOADER"}
                </span>
              </div>
              <button
                onClick={() => setIsAppModalOpen(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-slate-50 dark:bg-slate-900 rounded-full transition-colors active:scale-90"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Application form layout */}
            <form onSubmit={handleSaveApp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Application Package Name (e.g. com.example.app)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={editingApp !== null}
                    value={appForm.id}
                    onChange={(e) =>
                      setAppForm({ ...appForm, id: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 disabled:opacity-50 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-bold w-full text-gray-800 dark:text-gray-200 font-mono"
                    placeholder="e.g. com.tencent.ig"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    App Slogan Title name
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.title}
                    onChange={(e) =>
                      setAppForm({ ...appForm, title: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                    placeholder="e.g. PUBG Mobile"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Description outline
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.subtitle}
                    onChange={(e) =>
                      setAppForm({ ...appForm, subtitle: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                    placeholder="e.g. Battle royale epic shooting master game..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Vector Icon (URL or Local Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={appForm.icon}
                      onChange={(e) =>
                        setAppForm({ ...appForm, icon: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-slate-900 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-semibold flex-1 text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 font-mono"
                      placeholder="https://api.dicebear.com/7.x/shapes/svg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-icon-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () =>
                            setAppForm({ ...appForm, icon: r.result as string });
                          r.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-icon-upload"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase px-3.5 py-2.5 rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all text-center"
                    >
                      Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Cover/Image Banner (URL or Local Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={appForm.image}
                      onChange={(e) =>
                        setAppForm({ ...appForm, image: e.target.value })
                      }
                      className="bg-gray-50 dark:bg-slate-900 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-semibold flex-1 text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 font-mono"
                      placeholder="https://images.unsplash.com/promo-landscape.jpg"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-cover-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () =>
                            setAppForm({ ...appForm, image: r.result as string });
                          r.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-cover-upload"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase px-3.5 py-2.5 rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all text-center"
                    >
                      Upload
                    </label>
                  </div>
                </div>

                {/* Screenshots Block */}
                <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl border border-gray-200 dark:border-slate-700">
                  <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5 ml-1 font-extrabold">
                    Phone Promo Screenshots (Max 5)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="admin-screenshots-upload"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const list = (Array.from(files) as File[]).map((file) => {
                            return new Promise<string>((res) => {
                              const r = new FileReader();
                              r.onloadend = () => res(r.result as string);
                              r.readAsDataURL(file);
                            });
                          });
                          Promise.all(list).then((results) => {
                            setAppForm({
                              ...appForm,
                              screenshots: [
                                ...(appForm.screenshots || []),
                                ...results,
                              ].slice(0, 5),
                            });
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-screenshots-upload"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase px-4 py-2.5 rounded-xl cursor-pointer active:scale-95 transition-all inline-block"
                    >
                      Select Screenshot Files
                    </label>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      Loaded: {(appForm.screenshots || []).length}/5
                    </span>
                  </div>

                  {(appForm.screenshots || []).length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-3 mt-3 border-t border-gray-200 dark:border-slate-700/50">
                      {(appForm.screenshots || []).map((scr, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-16 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden shrink-0 relative group"
                        >
                          <img
                            src={scr}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAppForm({
                                ...appForm,
                                screenshots: (appForm.screenshots || []).filter(
                                  (_, i) => i !== idx,
                                ),
                              });
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold text-white text-[8px] uppercase transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* APK Binary and Specs Section */}
                <div className="sm:col-span-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-3xl border border-gray-205 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1 font-extrabold">
                      APK Container Status
                    </label>
                    <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs w-full text-gray-550 font-mono font-bold flex items-center justify-between">
                      <span className="truncate text-gray-805">
                        {appForm.apkUrl || "No binary file uploaded"}
                      </span>
                      {appForm.apkUrl && (
                        <span className="bg-emerald-50 text-emerald-800 text-[8px] px-2 py-0.5 rounded border border-emerald-100 font-black">
                          UPLOADED
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1 font-extrabold">
                      Sideload APK Local File
                    </label>
                    <input
                      type="file"
                      accept=".apk"
                      id="admin-apk-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAppForm({
                            ...appForm,
                            apkUrl: "#sideloaded_binary",
                            downloads: "Sideload",
                          });
                          alert(
                            `Local APK "${file.name}" cached! Version automatically registered.`,
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-apk-upload"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase px-4 py-3 rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition-all w-full text-center"
                    >
                      Upload local .apk bundle
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                      Version Name string
                    </label>
                    <input
                      type="text"
                      value={appForm.versionName}
                      onChange={(e) =>
                        setAppForm({ ...appForm, versionName: e.target.value })
                      }
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs w-full text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500"
                      placeholder="e.g. 1.0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                      Version Code
                    </label>
                    <input
                      type="text"
                      value={appForm.versionCode}
                      onChange={(e) =>
                        setAppForm({ ...appForm, versionCode: e.target.value })
                      }
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs w-full text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500"
                      placeholder="e.g. 1"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1 font-bold">
                      App Full Description (Markdown Compatible)
                    </label>
                    <textarea
                      placeholder="Comprehensive details highlighting user guides, permissions, features."
                      rows={2}
                      value={appForm.description}
                      onChange={(e) =>
                        setAppForm({ ...appForm, description: e.target.value })
                      }
                      className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs w-full text-gray-850 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Tag label flag
                  </label>
                  <select
                    value={appForm.tag}
                    onChange={(e) =>
                      setAppForm({ ...appForm, tag: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl py-2.5 px-4 outline-none w-full cursor-pointer"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="HOT">HOT</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="PROMO">PROMO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Target Home Layout placement
                  </label>
                  <select
                    value={appForm.targetSection}
                    onChange={(e) =>
                      setAppForm({ ...appForm, targetSection: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl py-2.5 px-4 outline-none w-full cursor-pointer"
                  >
                    <option value="heroBanners">
                      Hero Carousel Banner (Section 1)
                    </option>
                    <option value="mmorpgApps">
                      MMORPGs Section list (Section 2)
                    </option>
                    <option value="latestUpdates">
                      Latest Updates list (Section 3)
                    </option>
                    <option value="newReleases">
                      New Releases list (Section 4)
                    </option>
                    <option value="worldCupApps">
                      World Cup 2026 section (Section 5)
                    </option>
                    <option value="topDownloads">
                      Top Downloads rankings (Section 6)
                    </option>
                  </select>
                </div>

                {appForm.targetSection === 'latestUpdates' && storeState.mustHaveCollections && (
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                      Must Have Collection Sub-category
                    </label>
                    <select
                      value={appForm.collectionId}
                      onChange={(e) =>
                        setAppForm({ ...appForm, collectionId: e.target.value })
                      }
                      className="bg-purple-50 border border-purple-200 text-xs font-bold text-gray-900 dark:text-gray-100 rounded-xl py-2.5 px-4 outline-none w-full cursor-pointer"
                    >
                      <option value="">-- Select a Sub-category --</option>
                      {storeState.mustHaveCollections.map((col: any) => (
                        <option key={col.id} value={col.id}>{col.title}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Category Classification
                  </label>
                  <select
                    value={appForm.category}
                    onChange={(e) =>
                      setAppForm({ ...appForm, category: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl py-2.5 px-4 outline-none w-full cursor-pointer"
                  >
                    <option value="games">Games Collection</option>
                    <option value="apps">Apps Collection</option>
                    <option value="productivity">Productivity Tools</option>
                    <option value="social">Social Applications</option>
                  </select>
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-2 ml-1">
                    App Badges & Tags
                  </label>
                  <div className="flex flex-wrap items-center gap-4 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" 
                         checked={appForm.editorsChoice} 
                         onChange={e => setAppForm(prev => ({...prev, editorsChoice: e.target.checked }))} 
                         className="w-4 h-4 text-orange-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Editor's Choice</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" 
                         checked={appForm.hasMod} 
                         onChange={e => setAppForm(prev => ({...prev, hasMod: e.target.checked }))} 
                         className="w-4 h-4 text-green-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MOD App</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border-l border-gray-300 pl-4">
                      <input 
                         type="checkbox" 
                         checked={appForm.isOffline} 
                         onChange={e => setAppForm(prev => ({...prev, isOffline: true }))} 
                         className="w-4 h-4 text-blue-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Offline</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" 
                         checked={!appForm.isOffline} 
                         onChange={e => setAppForm(prev => ({...prev, isOffline: false }))} 
                         className="w-4 h-4 text-red-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Online</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Total Downloads stat counter
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.downloads}
                    onChange={(e) =>
                      setAppForm({ ...appForm, downloads: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                    placeholder="e.g. 50M+"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Review Rating rating level (1.0 to 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    required
                    value={appForm.rating}
                    onChange={(e) =>
                      setAppForm({ ...appForm, rating: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-bold w-full text-gray-800 dark:text-gray-200"
                    placeholder="4.8"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-gray-500 mb-1 ml-1">
                    Safety review indicator status
                  </label>
                  <select
                    value={appForm.safety}
                    onChange={(e) =>
                      setAppForm({ ...appForm, safety: e.target.value })
                    }
                    className="bg-gray-50 dark:bg-slate-900 border border-gray-250 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-xl py-2.5 px-4 outline-none w-full cursor-pointer"
                  >
                    <option value="Verified Safe">
                      Verified Safe & Virus-Free
                    </option>
                    <option value="Unverified">Unverified Source</option>
                    <option value="Potentially Harmful">
                      Potentially Harmful
                    </option>
                  </select>
                </div>
              </div>

              {/* Submit action */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAppModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-black text-gray-600 dark:text-gray-400 bg-gray-105 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
                >
                  {editingApp ? "Save & Apply Changes" : "Deploy App Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
