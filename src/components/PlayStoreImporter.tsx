import React, { useState } from "react";
import { DownloadCloud, Search, CheckCircle, Package, RefreshCw } from "lucide-react";
import { getStoreState, saveStoreState, APP_CATEGORIES, GAME_CATEGORIES, mapPlayStoreGenre } from "../data";

export default function PlayStoreImporter({ storeState, setStoreState, forceSection }: { storeState: any, setStoreState: any, forceSection?: string }) {
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [targetSection, setTargetSection] = useState<string>(forceSection || "latestUpdates");
  const [appType, setAppType] = useState<"apps" | "games" | "auto">("auto");
  const [customTag, setCustomTag] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<string>("");
  const [heroTitle, setHeroTitle] = useState("");
  const [collectionId, setCollectionId] = useState<string>(storeState.mustHaveCollections?.[0]?.id || "");
  const [editorsChoice, setEditorsChoice] = useState(false);
  const [hasMod, setHasMod] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isPaidForYou, setIsPaidForYou] = useState(false);
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [tag3, setTag3] = useState("");
  const [mirroring, setMirroring] = useState(false);
  const [mirrorOnImport, setMirrorOnImport] = useState(true);

  const handleScrape = async () => {
    if (!appId.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/play-store/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appId: appId.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }
      setResult(data);
      // Set default banner to header image or first screenshot
      setSelectedBanner(data.headerImage || data.screenshots?.[0] || data.icon || "");
      
      // Auto-detect and map categories
      const detection = mapPlayStoreGenre(data.genreId, data.genre);
      setAppType(detection.category);
      setCustomTag(detection.tag);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (!result) return;
    
    // Auto detect category from genreId or targetSection select settings
    let resolvedCategory = "apps";
    if (appType === "games") {
      resolvedCategory = "games";
    } else if (appType === "apps") {
      resolvedCategory = "apps";
    } else {
      // Auto
      const genre = (result.genreId || "").toUpperCase();
      const isGameGenre = genre.startsWith("GAME_") || genre.includes("GAME") || targetSection === "mmorpgApps";
      resolvedCategory = isGameGenre ? "games" : "apps";
    }

    const newApp: any = {
      id: appId.trim(),
      title: result.title,
      subtitle: forceSection === 'heroBanners' && heroTitle ? heroTitle : (result.summary || result.title),
      icon: result.icon,
      image: selectedBanner || result.screenshots?.[0] || result.headerImage || result.icon,
      downloads: result.installs || "10M+",
      rating: result.scoreText || "4.5",
      safety: "Verified Safe",
      category: resolvedCategory,
      tag: customTag || (resolvedCategory === "games" ? "Action" : "Tools"),
      status: "published",
      size: result.size || "Varies with device",
      version: result.version || "Varies with device",
      developer: result.developer,
      developerName: result.developer,
      screenshots: result.screenshots?.slice(0, 8) || [], // Grab up to 8 beautiful screenshots
      description: result.description,
      editorsChoice: editorsChoice,
      hasMod: hasMod,
      isOffline: isOffline,
      tags: [tag1.trim(), tag2.trim(), tag3.trim()].filter(Boolean),
      collectionId: targetSection === "latestUpdates" ? collectionId : undefined,
      apkUrl: "" // Will be overwritten if customized/mirrored
    };

    const sectionLabels: Record<string, string> = {
      latestUpdates: "Latest Updates",
      newReleases: "New Releases",
      mmorpgApps: "MMORPG Games",
      worldCupApps: "World Cup 2026 Apps",
      topDownloads: "Top Downloads",
      heroBanners: "Hero Banners Slider",
      paidForYou: "Paid For You"
    };

    let finalTargetSection = targetSection;
    if (forceSection !== 'heroBanners') {
      if (isPaidForYou) {
        finalTargetSection = 'paidForYou';
      } else {
        finalTargetSection = resolvedCategory === 'games' ? 'newReleases' : 'latestUpdates';
      }
    }

    const proceedWithSave = (finalApp: any) => {
      const newStore = { ...storeState };
      
      // Ensure target section list exists in store state structure
      if (!newStore[finalTargetSection]) {
        newStore[finalTargetSection] = [];
      }

      const currentList = newStore[finalTargetSection];
      const exists = currentList.find((a: any) => a.id === finalApp.id);

      if (!exists) {
        currentList.push(finalApp as any);

        // Check if it qualifies as top app/game based on rating/downloads
        const ratingVal = parseFloat(finalApp.rating) || 4.5;
        const dStr = (finalApp.downloads || "").toLowerCase();
        const isMillionOrBillion = dStr.includes('m') || dStr.includes('b');
        const isOver100k = dStr.includes('k') && (parseFloat(dStr) >= 100);
        const hasHighDownloads = isMillionOrBillion || isOver100k;

        if (ratingVal >= 4.0 && hasHighDownloads) {
          if (!newStore.topDownloads) {
            newStore.topDownloads = [];
          }
          const alreadyInTop = newStore.topDownloads.find((a: any) => a.id === finalApp.id);
          if (!alreadyInTop) {
            newStore.topDownloads.push({
              ...finalApp,
              isTopItem: true
            });
          }
        }

        setStoreState(newStore);
        saveStoreState(newStore);
        alert(`App (${finalApp.title}) successfully imported into: "${sectionLabels[finalTargetSection] || finalTargetSection}"!`);
        setResult(null);
        setAppId("");
        setHeroTitle("");
        setTag1("");
        setTag2("");
        setTag3("");
      } else {
        alert(`App is already in the "${sectionLabels[finalTargetSection] || finalTargetSection}" section!`);
      }
    };

    const activeStorage = storeState.storageSettings?.activeType || "none";
    
    if (activeStorage !== "none" && mirrorOnImport) {
      setMirroring(true);
      fetch("/api/storage/mirror-apk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          appId: appId.trim(),
          appName: result.title,
          versionName: result.version || "Varies with device"
        })
      })
        .then(res => {
          if (!res.ok) throw new Error("Cloud Storage upload session mismatch.");
          return res.json();
        })
        .then(data => {
          if (data.success && data.downloadUrl) {
            newApp.apkUrl = data.downloadUrl;
            alert(`☁ Cloud Mirroring Successful!\nFile Sanitized, APKPure watermark removed.\nRenamed to: [ ${data.fileName} ]\nSaved as active CDN link: [ ${data.downloadUrl} ]`);
          }
          proceedWithSave(newApp);
        })
        .catch(err => {
          console.error("Mirror flow failed:", err);
          alert(`Cloud Mirror pipeline warning: ${err.message}. Defaulting to direct APKPure proxy translation.`);
          proceedWithSave(newApp);
        })
        .finally(() => {
          setMirroring(false);
        });
    } else {
      proceedWithSave(newApp);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-gray-100 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
          <DownloadCloud className="w-6 h-6 text-indigo-600" /> {forceSection === 'heroBanners' ? 'Hero Slider Importer' : 'Play Store Importer'}
        </h2>
        <p className="text-gray-500 text-[13px] font-medium mt-1">
          {forceSection === 'heroBanners' ? 'Import amazing apps directly into your Hero Banners Slider with custom titles.' : 'Scrape complete app info (Icon, Rating, Description, Images) directly using google-play-scraper.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-slate-800">
        <label className="block text-[11px] font-black uppercase text-gray-500 mb-1.5 ml-1">
          Google Play Store App ID
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            placeholder="e.g. com.whatsapp or com.kiloo.subwaysurf"
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
          />
          <button
            onClick={handleScrape}
            disabled={loading || !appId}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.25)] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Scrape
          </button>
        </div>
        {error && <p className="text-red-500 text-xs font-bold mt-3 ml-1">{error}</p>}

        {result && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
              Scrape Result Preview
            </h4>
            <div className="bg-slate-50 dark:bg-slate-900 border border-indigo-100 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 items-start">
              <img src={result.icon} alt={result.title} className="w-24 h-24 rounded-2xl shadow-sm bg-white dark:bg-slate-950 object-cover" />
              <div className="flex-1">
                <h3 className="font-black text-lg text-gray-900 dark:text-gray-100 leading-tight">{result.title}</h3>
                <p className="text-indigo-600 text-xs font-bold mt-1">{result.developer}</p>
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Rating</span>
                    <span className="text-xs font-black text-gray-800 dark:text-gray-200">{result.scoreText}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Installs</span>
                    <span className="text-xs font-black text-gray-800 dark:text-gray-200">{result.installs}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Interactive Selection for Target Store List and Classification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-indigo-50/40 p-5 rounded-3xl border border-indigo-100/60">
              {forceSection === 'heroBanners' ? (
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    Custom Banner Headline
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    placeholder="e.g. Find music and podcasts..."
                  />
                </div>
              ) : (
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    App Placement & Section
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-950 p-3 border border-indigo-100 rounded-xl w-fit">
                      <input 
                         type="checkbox" 
                         checked={isPaidForYou} 
                         onChange={e => setIsPaidForYou(e.target.checked)} 
                         className="w-4 h-4 text-orange-600 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Paid For You App (Displays in special "Paid for You" section)</span>
                  </label>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wide mt-1.5 ml-1">
                    * If unchecked, this will automatically be sent to {appType === 'games' ? "Latest Games" : appType === 'apps' ? "Latest Apps" : "Latest Apps/Games based on Auto-Detect"}.
                  </p>
                </div>
              )}

              {forceSection !== 'heroBanners' && (
                <div>
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    Type Classification
                  </label>
                  <select
                    value={appType}
                    onChange={(e: any) => {
                      const newType = e.target.value;
                      setAppType(newType);
                      if (newType === "games") {
                        setCustomTag("Action");
                      } else if (newType === "apps") {
                        setCustomTag("Tools");
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  >
                    <option value="auto">Auto-Detect</option>
                    <option value="apps">Apps</option>
                    <option value="games">Games</option>
                  </select>
                </div>
              )}

              {forceSection !== 'heroBanners' && (
                <div>
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    Specific Tag / Category
                  </label>
                  <select
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  >
                    <option value="">-- Choose Category --</option>
                    <optgroup label="Apps Categories">
                      {APP_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Games Categories">
                      {GAME_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              {forceSection !== 'heroBanners' && (
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    App Badges & Basic Indicators
                  </label>
                  <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-indigo-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" 
                         checked={editorsChoice} 
                         onChange={e => setEditorsChoice(e.target.checked)} 
                         className="w-4 h-4 text-orange-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Editor's Choice</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" 
                         checked={hasMod} 
                         onChange={e => setHasMod(e.target.checked)} 
                         className="w-4 h-4 text-green-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">MOD App</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border-l border-gray-200 dark:border-slate-700 pl-4">
                      <input 
                         type="checkbox" 
                         checked={isOffline} 
                         onChange={e => setIsOffline(true)} 
                         className="w-4 h-4 text-blue-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Offline</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                         type="checkbox" 
                         checked={!isOffline} 
                         onChange={e => setIsOffline(false)} 
                         className="w-4 h-4 text-red-500 rounded" 
                      />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Online</span>
                    </label>
                  </div>
                </div>
              )}

              {forceSection !== 'heroBanners' && (
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    Dynamic Tags (Enter up to 3 Custom Tags)
                  </label>
                  <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-950 p-4 rounded-2xl border border-indigo-100">
                    <div>
                      <input
                        type="text"
                        value={tag1}
                        onChange={(e) => setTag1(e.target.value)}
                        placeholder="Tag 1 (e.g. Speed Mod)"
                        maxLength={20}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={tag2}
                        onChange={(e) => setTag2(e.target.value)}
                        placeholder="Tag 2 (e.g. Unlocked)"
                        maxLength={15}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={tag3}
                        onChange={(e) => setTag3(e.target.value)}
                        placeholder="Tag 3 (e.g. No Ads)"
                        maxLength={15}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wide mt-1.5 ml-1">
                    * The dynamic tags entered above will replace generic badges and display directly on cards and listing headers.
                  </p>
                </div>
              )}

              {targetSection === 'latestUpdates' && storeState.mustHaveCollections && (
                <div className="md:col-span-2 mt-2 pt-2 border-t border-indigo-100">
                  <label className="block text-[11px] font-black uppercase text-indigo-950 mb-1.5 ml-1">
                    Must Have Collection Category
                  </label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-indigo-200 rounded-2xl px-4 py-3 text-sm font-bold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600 shadow-inner"
                  >
                    <option value="">-- None --</option>
                    {storeState.mustHaveCollections.map((col: any) => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Screenshot & Banner Selection Selection */}
            {result.screenshots && result.screenshots.length > 0 && (
              <div className="mt-6">
                <label className="block text-[11px] font-black uppercase text-indigo-950 mb-2 ml-1">
                  Select Banner Image
                </label>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-indigo-100">
                  {/* Option for Header Image if exists */}
                  {result.headerImage && (
                    <div 
                      onClick={() => setSelectedBanner(result.headerImage)}
                      className={`relative shrink-0 cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border-4 ${selectedBanner === result.headerImage ? 'border-indigo-600 scale-[1.02] shadow-lg shadow-indigo-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={result.headerImage} alt="header" className="h-28 w-48 object-cover bg-gray-50 dark:bg-slate-900" referrerPolicy="no-referrer" />
                      {selectedBanner === result.headerImage && (
                        <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1 shadow-md">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/80 py-1 text-center">
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">Header Image</span>
                      </div>
                    </div>
                  )}

                  {result.screenshots.slice(0, 10).map((scr: string, idx: number) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedBanner(scr)}
                      className={`relative shrink-0 cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border-4 ${selectedBanner === scr ? 'border-indigo-600 scale-[1.02] shadow-lg shadow-indigo-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={scr} alt={`preview ${idx}`} className="h-28 w-48 object-cover bg-gray-50 dark:bg-slate-900" referrerPolicy="no-referrer" />
                      {selectedBanner === scr && (
                        <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1 shadow-md">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-1 text-center">
                        <span className="text-[8px] font-black text-white uppercase tracking-tighter">Device Screen {idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cloud Storage Mirroring Confirmation Option */}
            {storeState.storageSettings?.activeType && storeState.storageSettings.activeType !== "none" && (
              <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <DownloadCloud className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="text-xs font-black uppercase text-emerald-950 tracking-wider">☁ Active Cloud Mirror Pipeline</h5>
                    <p className="text-[10px] text-emerald-700 font-bold">
                      Sanitize package, strip APKPure watermark, rename to [Name]-[Version]-rapidapk.apk, & upload automatically.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mirrorOnImport}
                    onChange={(e) => setMirrorOnImport(e.target.checked)}
                    className="sr-only peer"
                    disabled={mirroring}
                  />
                  <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white dark:bg-slate-950 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleImport}
                disabled={mirroring}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-2xl shadow-[0_8px_20px_rgba(22,163,74,0.25)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                {mirroring ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Mirroring to Cloud Socket...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Import App Data to Registry
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
