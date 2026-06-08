import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getStoreState } from '../data';
import PlayConsoleSubmit from '../components/PlayConsoleSubmit';
import { 
  FileText, 
  ShieldCheck, 
  Globe, 
  Download, 
  Send, 
  Heart, 
  Award, 
  Smartphone, 
  Sparkles, 
  MessageSquare,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const state = getStoreState();
  
  // Safe default fallback if state is not fully migrated
  const info = state.infoPages || {
    aboutUs: "This RapidAPK.com is proudly run and managed by a single individual. Unlike massive profit-driven corporate app malls, this project was built from a passion to support developer transparency, privacy-respecting tools, and quick, clutter-free access.",
    aboutStore: "RapidAPK.com is a multiplatform app store specialized in Android. Our goal is to provide free and open access to a large catalog of apps without restrictions, offering a modern distribution platform directly from your browser.",
    editorialPolicy: "Every application listed on our store must submit to rigorous checks. Since I am an individual operator, I focus only on top quality products that are safe, lightweight, and genuinely valuable to users.\n\n• No Repetitive Clones: We filter spammy, low-value generic re-builds.\n• Active Antivirus Auditing: Packages are matched against virus definitions before inclusion.\n• Transparency: Clearly states if utilities trigger custom third-party SDK dependencies.",
    transparency: "We believe that Android application stores should never harvest user metadata, location logs, or bundle custom device telemetry. We do not inject telemetry code or background tracking pixels into our main app list, site, or layouts.\n\n1. Secure APK Mirroring: We mirror packages natively as authored by original developers — zero alterations, repackaging, or wrapper placements.\n\n2. Independent Integrity Checks: Every APK link is evaluated. Files hosting harmful trojans, dangerous trackers, or spyware are permanently banned.",
    clientNotes: "Install our portable web app companion directly on your Android device for instant notifications and faster download procedures.",
    clientApkUrl: "https://github.com/user/project/releases/download/v1/rapidapk_helper.apk",
    clientApkSize: "4.8 MB"
  };

  const [activeTab, setActiveTab] = useState<string>(slug || 'about-store');

  // Sync tab with URL parameter changes
  useEffect(() => {
    if (slug) {
      setActiveTab(slug);
    }
  }, [slug]);

  // Publish form states
  const [pubTitle, setPubTitle] = useState('');
  const [pubPackage, setPubPackage] = useState('');
  const [pubUrl, setPubUrl] = useState('');
  const [pubDesc, setPubDesc] = useState('');
  const [pubDevName, setPubDevName] = useState('');
  const [pubSubmitted, setPubSubmitted] = useState(false);

  // Promote form states
  const [promoName, setPromoName] = useState('');
  const [promoEmail, setPromoEmail] = useState('');
  const [promoDetails, setPromoDetails] = useState('');
  const [promoSubmitted, setPromoSubmitted] = useState(false);

  // Download simulation states
  const [clientDLState, setClientDLState] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [clientProgress, setClientProgress] = useState(0);

  const startClientDownload = () => {
    if (clientDLState !== 'idle') return;
    setClientDLState('downloading');
    setClientProgress(0);
    const interval = setInterval(() => {
      setClientProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setClientDLState('completed');
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle || !pubPackage || !pubUrl || !pubDevName) return;
    
    // Save submission locally for active simulation
    const submissions = JSON.parse(localStorage.getItem('appstore_publisher_submissions') || '[]');
    submissions.push({
      id: Date.now().toString(),
      title: pubTitle,
      packageName: pubPackage,
      downloadUrl: pubUrl,
      description: pubDesc,
      developer: pubDevName,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('appstore_publisher_submissions', JSON.stringify(submissions));
    setPubSubmitted(true);
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoName || !promoEmail || !promoDetails) return;

    const promos = JSON.parse(localStorage.getItem('appstore_promotion_requests') || '[]');
    promos.push({
      id: Date.now().toString(),
      name: promoName,
      email: promoEmail,
      details: promoDetails,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('appstore_promotion_requests', JSON.stringify(promos));
    setPromoSubmitted(false); // Reset to allow viewing or simulate a beautiful success dialog
    setPromoSubmitted(true);
  };

  const resetPublishForm = () => {
    setPubTitle('');
    setPubPackage('');
    setPubUrl('');
    setPubDesc('');
    setPubDevName('');
    setPubSubmitted(false);
  };

  const resetPromoteForm = () => {
    setPromoName('');
    setPromoEmail('');
    setPromoDetails('');
    setPromoSubmitted(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />

      {/* Navigation Inside Info Hub */}
      <div className="bg-slate-900 text-white py-12 px-5 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-md mx-auto relative z-10">
          <span className="text-[11px] font-black tracking-widest text-blue-400 uppercase bg-blue-500/15 px-3 py-1.5 rounded-full inline-block mb-3 border border-blue-500/20">
            Store Hub & Services
          </span>
          <h1 className="text-3xl font-black tracking-tight leading-tight uppercase">
            {activeTab === 'about-us' && "About Us"}
            {activeTab === 'about-appstore' && "About RapidAPK"}
            {activeTab === 'editorial-policy' && "Editorial Policy"}
            {activeTab === 'transparency' && "Transparency & Trust"}
            {activeTab === 'client' && "Android Client"}
            {activeTab === 'publish' && "Submit your app"}
            {activeTab === 'promote' && "Promote your app"}
          </h1>
          <p className="text-sm text-slate-300 font-medium mt-1 leading-normal">
            {activeTab === 'about-us' && `Meet the developer running ${state.siteSettings.title}`}
            {activeTab === 'about-appstore' && `What makes ${state.siteSettings.title} different`}
            {activeTab === 'editorial-policy' && "How we verify and select clean applications"}
            {activeTab === 'transparency' && "Our open guidelines and full user privacy guarantee"}
            {activeTab === 'client' && "Download our standalone sideloading helper client"}
            {activeTab === 'publish' && "Singly publish and catalog your app with us"}
            {activeTab === 'promote' && "Request a featured spotlight on our homepage"}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="px-5 py-8 flex-1 max-w-md mx-auto w-full">
        {/* Dynamic Section Contents */}
        {activeTab === 'about-us' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                <Heart className="w-8 h-8 fill-blue-600/10" />
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase mb-2">Independent Platform</h2>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 font-semibold leading-relaxed mt-2 whitespace-pre-line text-left w-full">
                {info.aboutUs}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2 text-sm uppercase">
                <Award className="w-4 h-4 text-blue-500" /> Our Unique Mission
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-semibold">
                • <strong>100% Free:</strong> No hidden payment paywalls for basic application downloads.<br />
                • <strong>No Bloat:</strong> No tracking services, background telemetry, or forced pop-ups.<br />
                • <strong>Aesthetic First:</strong> Beautifully crafted interface engineered to discover the exact Android tools you require.
              </p>
              <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 mt-2">
                <span className="text-[11px] text-blue-600 block font-black uppercase tracking-wider">Contact Operator</span>
                <span className="text-sm font-black text-gray-800 dark:text-gray-200 break-all">{state.siteSettings.contactEmail}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about-appstore' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-[15px] uppercase">The Android Hub</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Sideloading made comfortable</p>
                </div>
              </div>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold whitespace-pre-line">
                {info.aboutStore}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-gray-950 text-xs border-b border-gray-100 dark:border-slate-800 pb-2 uppercase tracking-wide">
                Key Features at a Glance:
              </h3>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 block uppercase">No Account Req.</span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">Get APK files immediately without sign-ups.</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 block uppercase">Open Source Prefer.</span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">We prioritize open software utilities.</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 block uppercase">Pure Security</span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">Files verified for structural malware.</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <span className="text-[11px] font-black text-gray-800 dark:text-gray-200 block uppercase">Ultra Fast DL</span>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">No intentional speed limiters.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editorial-policy' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex gap-3 items-center">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-black text-gray-900 dark:text-gray-100 border-none uppercase">Selection Guidelines</h2>
              </div>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold whitespace-pre-line text-left">
                {info.editorialPolicy}
              </p>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-400 font-black block uppercase tracking-wide">Found an issue with a listing?</span>
                <span className="text-xs font-semibold text-slate-300 mt-1 block">Help maintain our index's premium health.</span>
              </div>
              <button 
                onClick={() => { window.location.href = '/info/about-us'; }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2.5 shadow-md active:scale-95 transition-all text-xs font-bold"
              >
                Report APP
              </button>
            </div>
          </div>
        )}

        {activeTab === 'transparency' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex gap-3 items-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-black text-gray-900 dark:text-gray-100 uppercase">Privacy & Safety Pledge</h2>
              </div>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold whitespace-pre-line text-left">
                {info.transparency}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'client' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
                <Smartphone className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-gray-100 uppercase">Portable Client Helper</h2>
              <p className="text-[13px] text-gray-500 mt-1 leading-normal font-semibold whitespace-pre-line">
                {info.clientNotes}
              </p>

              {/* Sideload APK Download Simulator */}
              <div className="mt-8 bg-gray-50 dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 text-left">
                <h4 className="text-xs font-black text-gray-950 uppercase border-b border-slate-200 dark:border-slate-700/60 pb-1.5 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Active Sideload Helper
                </h4>
                <div className="flex justify-between text-[11px] text-gray-500 mb-2 font-semibold">
                  <span>Filename: {info.clientApkUrl.split('/').pop() || 'appstore_helper.apk'}</span>
                  <span>Size: {info.clientApkSize || '4.8 MB'}</span>
                </div>

                {clientDLState === 'idle' && (
                  <button 
                    onClick={startClientDownload}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-blue-600/20 active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download APK Package
                  </button>
                )}

                {clientDLState === 'downloading' && (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1.5">
                      <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-150" style={{ width: `${clientProgress}%` }}></div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold block text-center uppercase tracking-wider">Downloading... {clientProgress}%</span>
                  </div>
                )}

                {clientDLState === 'completed' && (
                  <div className="bg-emerald-50 text-emerald-800 rounded-xl p-3 border border-emerald-100 flex items-center justify-between text-xs font-bold leading-normal">
                    <span className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" /> {info.clientApkUrl.split('/').pop() || 'helper.apk'} Ready</span>
                    <button 
                      onClick={() => setClientDLState('idle')}
                      className="text-blue-600 hover:underline shrink-0 font-extrabold uppercase text-[10px]"
                    >
                      Restart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'publish' && (
          <div className="space-y-6">
            <PlayConsoleSubmit />
          </div>
        )}

        {activeTab === 'promote' && (
          <div className="space-y-6">
            {promoSubmitted ? (
              <div className="bg-white dark:bg-slate-950 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-blue-100">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-black text-gray-900 dark:text-gray-100 text-lg uppercase">Pitch Submitted!</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-2 px-3">
                  Your feature proposal was successfully submitted straight to the store owner's catalog queue. If your application matches our safety, utility, and user usability requirements, we will schedule it for an active spotlight!
                </p>
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-center gap-3">
                  <button 
                    onClick={resetPromoteForm}
                    className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-black px-6 py-3 rounded-full border border-gray-200 dark:border-slate-700 transition-colors"
                  >
                    Pitch Another App
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-3 rounded-full transition-all"
                  >
                    Go Back Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePromoteSubmit} className="bg-white dark:bg-slate-950 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                <div className="border-b border-gray-50 pb-3 mb-4">
                  <h3 className="font-extrabold text-gray-950 text-base uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Promote your app
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">Suggest featuring your app under our Hero banner or Top Picks category.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1.5 uppercase">App / Project Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Astro Launcher"
                      value={promoName}
                      onChange={e => setPromoName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1.5 uppercase">Contact Email *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="developer@yourdomain.com"
                      value={promoEmail}
                      onChange={e => setPromoEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:bg-white dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 dark:text-gray-300 block mb-1.5 uppercase">Why should this app be featured? *</label>
                    <textarea 
                      required
                      placeholder="Tell us what makes your app amazing and why our users will love the spotlight..."
                      rows={4}
                      value={promoDetails}
                      onChange={e => setPromoDetails(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:border-blue-500 focus:bg-white dark:bg-slate-950"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs py-3.5 rounded-full flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] mt-5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> Send Showcase Pitch
                </button>
              </form>
            )}
          </div>
        )}

        {/* Menu Hub Segment Selector */}
        <div className="mt-8 bg-slate-100 rounded-[1.75rem] p-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
          <span className="text-[10px] text-gray-500 font-extrabold uppercase px-2 mb-2 tracking-wider">Explore sections</span>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => { window.location.href = '/info/about-us'; }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase text-left transition-colors truncate ${activeTab === 'about-us' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900'}`}
            >
              • About Us
            </button>
            <button 
              onClick={() => { window.location.href = '/info/about-appstore'; }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase text-left transition-colors truncate ${activeTab === 'about-appstore' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900'}`}
            >
              • About RapidAPK
            </button>
            <button 
              onClick={() => { window.location.href = '/info/editorial-policy'; }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase text-left transition-colors truncate ${activeTab === 'editorial-policy' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900'}`}
            >
              • Policy
            </button>
            <button 
              onClick={() => { window.location.href = '/info/transparency'; }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase text-left transition-colors truncate ${activeTab === 'transparency' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900'}`}
            >
              • Trust
            </button>
            <button 
              onClick={() => { window.location.href = '/info/publish'; }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase text-left transition-colors truncate ${activeTab === 'publish' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900'}`}
            >
              • Submit App
            </button>
            <button 
              onClick={() => { window.location.href = '/info/promote'; }}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs uppercase text-left transition-colors truncate col-span-2 ${activeTab === 'promote' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-950 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900'}`}
            >
              🌟 Feature Spotlight Request
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
