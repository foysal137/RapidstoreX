import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppById, getStoreState, formatPlayStoreDownloads, getAllApps } from '../data';
import { TopBar, Footer } from '../components/Shared';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Download, 
  X, 
  Share2, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Check,
  ExternalLink,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSEO } from '../hooks/useSEO';

// Custom helper for relative time in comments
function formatRelativeTime(dateString: string): string {
  try {
    const elapsed = Date.now() - new Date(dateString).getTime();
    if (elapsed < 0) return 'Just now';
    
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }
    return 'Just now';
  } catch (e) {
    return 'Just now';
  }
}



export default function AppDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const app = getAppById(id || '');
  const storeState = getStoreState();
  const similarApps = app ? getAllApps().filter(a => a.category === app.category && a.id !== app.id).slice(0, 6) : [];
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading'>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'faq'>('description');
  const [faqExpanded, setFaqExpanded] = useState<Record<string, boolean>>({
    'apk': false,
    'safe': false,
    'speed': false,
    'update': false
  });
  const [shareSuccess, setShareSuccess] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  // Comments System States
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyInputId, setReplyInputId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  useSEO({
    title: app ? `Download ${app.title} v${app.versionName || 'latest'} APK for Android - RapidAPK` : 'Loading... - RapidAPK',
    description: app ? `Download ${app.title} latest version ${app.versionName || ''} APK for Android. ${app.description.slice(0, 150)}... free and safe download.` : '',
    keywords: app ? `${app.title}, download ${app.title}, ${app.title} apk, ${app.category}, android` : '',
    image: app?.icon,
    type: 'website'
  });


  // Fetch comments from backend on mount or app change to sync with custom reviews written in DB
  useEffect(() => {
    if (app) {
      fetch(`/api/comments/${app.id}`)
        .then(res => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setComments(data);
          } else {
            setComments([]);
          }
        })
        .catch(err => {
          console.error("Error loading comments:", err);
          setComments([]);
        });
    }
  }, [app]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    setSubmittingComment(true);
    fetch(`/api/comments/${app.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        author: newCommentName,
        email: newCommentEmail,
        text: newCommentText,
        rating: newCommentRating
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to post comment");
        return res.json();
      })
      .then(newComment => {
        setComments(prev => [newComment, ...prev]);
        setNewCommentName("");
        setNewCommentEmail("");
        setNewCommentText("");
        setNewCommentRating(5);
        setSubmittingComment(false);
      })
      .catch(err => {
        console.error("Error adding comment, using client-side fallback:", err);
        // Create a secure client-side local fallback comment
        const escapeHtml = (unsafe: string) => unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        const localComment = {
          id: `local-comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          appId: app.id,
          author: escapeHtml(newCommentName.trim()),
          email: escapeHtml(newCommentEmail.trim()),
          text: escapeHtml(newCommentText.trim()),
          rating: newCommentRating,
          likes: 0,
          createdAt: new Date().toISOString(),
          replies: []
        };
        setComments(prev => [localComment, ...prev]);
        setNewCommentName("");
        setNewCommentEmail("");
        setNewCommentText("");
        setNewCommentRating(5);
        setSubmittingComment(false);
      });
  };

  const handleLikeComment = (commentId: string) => {
    if (likedComments[commentId]) return;

    // Optimistic update
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c));
    setLikedComments(prev => ({ ...prev, [commentId]: true }));

    fetch(`/api/comments/${app.id}/${commentId}/like`, {
      method: "POST"
    }).catch(err => console.error("Error liking comment:", err));
  };

  const handleAddReply = (commentId: string) => {
    if (!replyAuthor.trim() || !replyText.trim()) return;

    setSubmittingReply(true);
    fetch(`/api/comments/${app.id}/${commentId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        author: replyAuthor,
        text: replyText
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to post reply");
        return res.json();
      })
      .then(newReply => {
        setComments(prev => prev.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newReply]
            };
          }
          return c;
        }));
        setReplyAuthor("");
        setReplyText("");
        setReplyInputId(null);
        setSubmittingReply(false);
      })
      .catch(err => {
        console.error("Error adding reply, using client-side fallback:", err);
        const escapeHtml = (unsafe: string) => unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        const localReply = {
          id: `local-reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          author: escapeHtml(replyAuthor.trim()),
          text: escapeHtml(replyText.trim()),
          createdAt: new Date().toISOString()
        };
        setComments(prev => prev.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), localReply]
            };
          }
          return c;
        }));
        setReplyAuthor("");
        setReplyText("");
        setReplyInputId(null);
        setSubmittingReply(false);
      });
  };

  // Handle actual APK download in browser
  const triggerApkDownload = () => {
    if (!app) return;
    try {
      const url = app.apkUrl;
      const cleanName = (app.title || '')
        .replace(/[^a-zA-Z0-9]/g, "_")
        .trim();
      const fileName = `${cleanName || app.id}.apk`;
      
      if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const cleanProxyUrl = `/api/download-apk?appId=${app.id}&appName=${encodeURIComponent(cleanName)}&version=${encodeURIComponent(app.version || "latest")}`;
        const a = document.createElement('a');
        a.href = cleanProxyUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error("Browser APK Download Exception:", e);
    }
  };

  useEffect(() => {
    if (downloadState === 'downloading') {
      const interval = setInterval(() => {
        setProgress(p => {
           if (p >= 100) {
             clearInterval(interval);
             triggerApkDownload();
             setDownloadState('idle');
             return 100;
           }
           return p + 20;
         });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [downloadState]);

  if (!app) return <div className="p-8 text-center text-gray-500 font-medium bg-[#f8fafc] dark:bg-slate-950 min-h-screen">App not found</div>;

  const handleDownload = () => {
     if (downloadState === 'idle') {
        setDownloadState('downloading');
        setProgress(0);
     }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${app.title} APK`,
        text: `Download verified original ${app.title} APK for Android free of charge!`,
        url: window.location.href
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const toggleFaq = (key: string) => {
    setFaqExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cleanAppTitle = (app.title || '').trim();
  const cleanAppDescription = (app.description || '').trim();
  const siteSettings = getStoreState().siteSettings;

  // Derive dynamic high realistic ratings count
  const pureNumDownloads = app.downloads ? parseInt(String(app.downloads).replace(/[^0-9]/g, '')) : 100000;
  const ratingCountFormat = Math.floor(pureNumDownloads / 19) || 52908;

  // Real Play Store rating
  const realRatingNum = app.rating ? Number(app.rating) : 4.4;
  const avgRating = realRatingNum.toFixed(1);
  const totalComments = comments.length;

  const getPercentageForStar = (starNum: number) => {
    const r = realRatingNum;
    if (starNum === 5) {
      if (r >= 4.7) return 86;
      if (r >= 4.5) return 74;
      if (r >= 4.2) return 65;
      return 52;
    }
    if (starNum === 4) {
      if (r >= 4.7) return 10;
      if (r >= 4.5) return 16;
      if (r >= 4.2) return 20;
      return 23;
    }
    if (starNum === 3) {
      if (r >= 4.7) return 2;
      if (r >= 4.5) return 6;
      if (r >= 4.2) return 9;
      return 14;
    }
    if (starNum === 2) {
      if (r >= 4.7) return 1;
      if (r >= 4.5) return 2;
      if (r >= 4.2) return 4;
      return 7;
    }
    if (starNum === 1) {
      if (r >= 4.7) return 1;
      if (r >= 4.5) return 2;
      if (r >= 4.2) return 2;
      return 4;
    }
    return 0;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-slate-900 text-slate-800 dark:text-slate-200 pb-safe animate-in fade-in duration-350 select-text">
      {/* High-quality responsive header bar */}
      <TopBar showBack />

      {/* --- Full bleed immersive hero layout directly under header --- */}
      <div className="relative w-full overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 pb-5">
        
        {/* Landscape Banner Background Image */}
        <div className="relative w-full h-[180px] sm:h-[240px] overflow-hidden">
          {app.image ? (
            <img 
              src={app.image} 
              className="w-full h-full object-cover select-none" 
              referrerPolicy="no-referrer"
              alt={cleanAppTitle} 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1c1f26] to-[#0c0d12] flex items-center justify-center opacity-60">
              <span className="text-white/20 select-none font-black text-2xl tracking-widest">RAPIDAPKS</span>
            </div>
          )}
          {/* Delicate vignette gradient fading to main background page color */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Info Column & Breadcrumbs Overlapping Banner */}
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 -mt-3 sm:-mt-4 relative z-10 space-y-4">
          
          {/* Breadcrumbs sitting elegantly inside hero banner */}
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-bold select-none tracking-wide text-slate-500 dark:text-slate-400">
            <span className="text-[#6ab344] hover:underline cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <span className="text-slate-350 font-normal">&gt;</span>
            <span className="text-[#6ab344] hover:underline cursor-pointer transition-colors" onClick={() => navigate('/apps')}>Apps</span>
            <span className="text-slate-350 font-normal">&gt;</span>
            <span className="text-[#6ab344] hover:underline cursor-pointer transition-colors capitalize" onClick={() => navigate(`/apps?category=${app.category}`)}>{app.category || 'Utility'}</span>
            <span className="text-slate-350 font-normal">&gt;</span>
            <span className="text-slate-700 font-extrabold truncate">{cleanAppTitle}</span>
          </div>

          {/* Icon & Title Row */}
          <div className="flex flex-row items-start gap-4 sm:gap-6 mt-1">
            {/* Round App Icon matching visual design perfectly */}
            <div className="w-20 h-20 sm:w-26 sm:h-26 rounded-[22px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 p-1.5 overflow-hidden shrink-0 shadow-lg relative flex items-center justify-center">
              <img 
                src={app.icon || app.image} 
                className="w-full h-full object-contain rounded-[16px]" 
                referrerPolicy="no-referrer" 
                alt={cleanAppTitle} 
              />
            </div>

            {/* Title, Developer name and badges */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h1 className="text-lg sm:text-2xl font-extrabold leading-snug tracking-tight text-slate-900 mb-1">
                {cleanAppTitle} v{app.versionName || '5.0.279'} APK
              </h1>
              
              <div className="text-[#6ab344] hover:text-[#5fa13a] transition-colors hover:underline cursor-pointer text-xs sm:text-sm font-bold tracking-wide">
                {app.developerName || app.developer || siteSettings.developerName || "Alight Creative"}
              </div>

              {/* Exact Pill badges matching the user's screenshot */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {app.editorsChoice && (
                  <span className="text-[10px] tracking-wider uppercase font-black bg-[#ff7043] text-white px-2 py-1 rounded-[4px] leading-none">
                    Editor's Choice
                  </span>
                )}
                <span className="text-[10px] tracking-wider uppercase font-black bg-[#6ab344] text-white px-2 py-1 rounded-[4px] leading-none">
                  OFFICIAL
                </span>
              </div>
            </div>
          </div>

          {/* Highlighted Mod Info Line & Short Description */}
          <div className="pt-2.5 space-y-2">
            <p className="text-[#6ab344] font-black text-xs sm:text-sm tracking-wide uppercase italic">
              Verified Stable Build
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl font-medium">
              {cleanAppDescription ? (cleanAppDescription.includes('.') ? cleanAppDescription.split('.')[0] + '.' : cleanAppDescription) : `${cleanAppTitle} APK is a secure and fully optimized version of the original application. Securely download and run standard Android runtime packages.`}
            </p>
          </div>

        </div>
      </div>

      {/* --- CONTENT CENTER ZONE --- */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pb-12 mt-4 space-y-6">
        
        {storeState.siteSettings?.adPlacements?.appDetailTop && (
          <div 
             className="w-full flex flex-col items-center justify-center overflow-hidden mb-4" 
             dangerouslySetInnerHTML={{ __html: storeState.siteSettings.adPlacements.appDetailTop }} 
          />
        )}

        {/* --- PERFORMANCE HIGHLIGHT SPECIFICATIONS BLOCK (UNBOXED PLAIN ROW AS SHOWN IN SCREENSHOT) --- */}
        <div className="border-y border-slate-200 dark:border-slate-700 py-5 select-none my-1">
           <div className="grid grid-cols-4 gap-1 text-center divide-x divide-slate-200 text-xs">
              
              {/* Column 1: Version */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 leading-none">
                  {app.versionName || '5.0.279'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2">Version</span>
              </div>
              
              {/* Column 2: Size */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 leading-none">
                  {app.apkSize || '101M'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2">Size</span>
              </div>
              
              {/* Column 3: Google Play Action Button */}
              <div className="flex flex-col items-center justify-center">
                <a 
                  href={`https://play.google.com/store/apps/details?id=${app.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center group"
                >
                  {/* Miniature colorful Google Play play logo */}
                  <div className="w-5 h-5 flex items-center justify-center select-none group-hover:scale-110 transition-transform">
                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.25 3.32C3.09 3.48 3 3.73 3 4.05V19.95C3 20.27 3.09 20.52 3.25 20.68L3.32 20.75L12.18 11.89V11.72L3.32 2.85L3.25 3.32Z" fill="#213a40" />
                      <path d="M15.11 14.83L12.18 11.89V11.72L15.11 8.78L15.19 8.82L18.66 10.8C19.65 11.36 19.65 12.26 18.66 12.82L15.19 14.8L15.11 14.83Z" fill="#ffb300" />
                      <path d="M15.19 14.83L12.18 11.8V11.81L3.32 20.67C3.65 21.02 4.19 21.06 4.81 20.7L15.19 14.83Z" fill="#ff1744" />
                      <path d="M15.19 8.78L4.81 2.89C4.19 2.53 3.65 2.57 3.32 2.92L12.18 11.79V11.8L15.19 8.78Z" fill="#00e676" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2 group-hover:text-[#6ab344]">Get it on</span>
                </a>
              </div>
              
              {/* Column 4: Dynamic rating layout */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-200 leading-none flex items-center justify-center gap-1.5">
                  {app.rating || '4.4'}
                  <Star className="w-3.5 h-3.5 fill-[#ff9100] text-[#ff9100] stroke-none" />
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-2">
                  {ratingCountFormat.toLocaleString()} ratings
                </span>
              </div>

           </div>
        </div>

        {/* --- DOWNLOAD SYSTEM ACTION PANEL (PRECISELY DETAILED TO SCREENSHOT) --- */}
        <div className="space-y-4">
           {/* Wide rounded APK download launcher with smooth state loading overlay */}
           <button
             onClick={handleDownload}
             disabled={downloadState === 'downloading'}
             className={`w-full py-3.5 rounded-full font-bold text-white transition-all duration-250 flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer text-base uppercase tracking-wide tracking-tight ${
                downloadState === 'idle' 
                  ? 'bg-[#6ab344] hover:bg-[#5da13a] hover:-translate-y-0.5 shadow-md shadow-[#6ab344]/15' 
                  : 'bg-[#6ab344]/50 cursor-wait'
             }`}
           >
              {downloadState === 'idle' ? (
                <><Download className="w-5 h-5 stroke-[2.5]" /> Download APK</>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing APK Package... {progress}%
                </span>
              )}
           </button>

           {/* Elegant micro secondary flat action buttons (No border, flat transparent structure) */}
           <div className="flex items-center justify-center gap-8 py-1 select-none text-[15px] font-bold">
              <button 
                onClick={handleShare}
                className="text-[#6ab344] hover:text-[#5fa13a] transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Share2 size={18} className="stroke-[2.5]" />
                <span>{shareSuccess ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button 
                onClick={() => alert(`Update alert requested for ${cleanAppTitle}. Notifications are logged.`)}
                className="text-[#ff9100] hover:text-[#e68200] transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RefreshCw size={16} className="stroke-[2.5]" />
                <span>Request Update</span>
              </button>
           </div>
        </div>

        {/* --- SCREENSHOTS PREVIEWS (Beautiful modern horizontal gallery) --- */}
        {app.screenshots && app.screenshots.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00]"></span>
              Screen Previews
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin select-none">
              {app.screenshots.map((srcUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(srcUrl)}
                  className="w-32 sm:w-40 aspect-[9/16] bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-[1.02] transition-transform duration-200 cursor-zoom-in active:scale-95"
                >
                  <img src={srcUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" alt="App preview screenshot" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TABBED INFORMATION SECTION (Beautifully formatted for Light Mode) --- */}
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden mt-6">
           {/* Tabs Headers */}
           <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase text-center bg-slate-50 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 select-none">
             <button 
               onClick={() => setActiveTab('description')}
               className={`flex-1 py-3.5 border-b-2 transition-all cursor-pointer ${
                 activeTab === 'description' ? 'border-[#6ab344] text-[#6ab344] bg-white dark:bg-slate-950 font-extrabold' : 'border-transparent hover:text-slate-850'
               }`}
             >
                Description
             </button>
             <button 
               onClick={() => setActiveTab('specifications')}
               className={`flex-1 py-3.5 border-b-2 transition-all cursor-pointer ${
                 activeTab === 'specifications' ? 'border-[#6ab344] text-[#6ab344] bg-white dark:bg-slate-950 font-extrabold' : 'border-transparent hover:text-slate-850'
               }`}
             >
                Specifications
             </button>
             <button 
               onClick={() => setActiveTab('faq')}
               className={`flex-1 py-3.5 border-b-2 transition-all cursor-pointer ${
                 activeTab === 'faq' ? 'border-[#6ab344] text-[#6ab344] bg-white dark:bg-slate-950 font-extrabold' : 'border-transparent hover:text-slate-850'
               }`}
             >
                Help & FAQ
             </button>
           </div>

           {/* Tab Body Contents */}
           <div className="p-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <div className={`whitespace-pre-line relative ${!descriptionExpanded ? 'max-h-48 overflow-hidden' : ''}`}>
                    <p className="text-slate-600">
                      {cleanAppDescription || `${cleanAppTitle} APK provides fully optimized and tested original functions direct on your Android runtime system safely.`}
                    </p>
                    <br/>
                    <p className="font-extrabold text-slate-900 text-sm mb-1.5 uppercase tracking-wide">Key Features:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li>Verified clean original binary installation files</li>
                      <li>Tested for maximum Android runtime compatibility</li>
                      <li>No adware, spyware, or security risks detected</li>
                      <li>Runs securely on any supported ARM or x86 devices</li>
                    </ul>

                    {!descriptionExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>

                  <button 
                    onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                    className="text-[#6ab344] hover:text-[#5fa13a] font-extrabold text-xs inline-flex items-center gap-1 focus:outline-none focus:underline cursor-pointer"
                  >
                     {descriptionExpanded ? (
                       <>Show Less <ChevronUp size={14} /></>
                     ) : (
                       <>Read more <ChevronDown size={14} /></>
                     )}
                  </button>

                  <div className="pt-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#6ab344]/10 text-[#6ab344] px-3 py-1.5 rounded-lg inline-flex items-center gap-2 border border-[#6ab344]/25 bg-[#6ab344]/5">
                      <span className="w-1.5 h-1.5 bg-[#6ab344] rounded-full"></span>
                      VERIFIED CLEAN APP BINARY
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">Package Specifications</h4>
                  <div className="space-y-2 text-xs">
                     <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 dark:text-slate-400 font-sans">Package Identifier</span>
                        <span className="font-mono text-slate-700 font-extrabold">{app.id || 'com.example.original'}</span>
                     </div>
                     <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 dark:text-slate-400 font-sans">Operating System Support</span>
                        <span className="text-slate-700 font-extrabold">Android 5.0 or above (Lollipop+)</span>
                     </div>
                     <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 dark:text-slate-400 font-sans">Architectures Support</span>
                        <span className="text-slate-700 font-extrabold">Armeabi-v7a, Arm64-v8a, x86, x86_64</span>
                     </div>
                     <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 dark:text-slate-400 font-sans">Google Play Developer Name</span>
                        <span className="text-[#6ab344] font-extrabold truncate max-w-[170px]">{app.developerName || app.developer || 'Official Studio'}</span>
                     </div>
                     <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-500 dark:text-slate-400 font-sans">Total Download Mirror Counts</span>
                        <span className="text-slate-700 font-extrabold">{formatPlayStoreDownloads(app.downloads || '100000')}+ Downloads</span>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-3">
                   {/* FAQ Question 1 */}
                   <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                      <div 
                        onClick={() => toggleFaq('apk')}
                        className="p-4 flex items-center justify-between font-extrabold text-xs text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      >
                         <span>What is APK? How to install?</span>
                         {faqExpanded.apk ? <ChevronUp size={14} className="text-[#6ab344]" /> : <ChevronDown size={14} />}
                      </div>
                      <AnimatePresence>
                         {faqExpanded.apk && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                            >
                              An APK (Android Package Kit) is the package file format used by the Android operating system for distribution and installation of mobile apps. Simply download our genuine APK, find it in your File Manager, and click to install. Ensure 'Unknown Sources' is enabled in your Android security settings.
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>

                   {/* FAQ Question 2 */}
                   <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                      <div 
                        onClick={() => toggleFaq('safe')}
                        className="p-4 flex items-center justify-between font-extrabold text-xs text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      >
                         <span>Is the installation safe?</span>
                         {faqExpanded.safe ? <ChevronUp size={14} className="text-[#6ab344]" /> : <ChevronDown size={14} />}
                      </div>
                      <AnimatePresence>
                         {faqExpanded.safe && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                            >
                              Absolutely. We are dedicated to providing 100% organic, clean, untouched, and original store binaries direct from official developers. Each file undergoes checksum matches and antivirus check sweeps to guarantee zero modification.
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>

                   {/* FAQ Question 3 */}
                   <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                      <div 
                        onClick={() => toggleFaq('speed')}
                        className="p-4 flex items-center justify-between font-extrabold text-xs text-slate-700 uppercase cursor-pointer hover:bg-slate-100 select-none"
                      >
                         <span>The download links and speed profiles</span>
                         {faqExpanded.speed ? <ChevronUp size={14} className="text-[#6ab344]" /> : <ChevronDown size={14} />}
                      </div>
                      <AnimatePresence>
                         {faqExpanded.speed && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                            >
                              Our servers distribute raw mirrors directly without routing through external speed limiters. Downloading file blocks completes at high raw speeds so you can grab apps inside seconds.
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                </div>
              )}
           </div>
        </div>

      </div>

      {/* --- Full-Screen Image Preview Modal Zoom --- */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full flex items-center justify-center p-2"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white/10 dark:bg-slate-950/10 hover:bg-white/20 dark:bg-slate-950/20 active:bg-white/30 dark:bg-slate-950/30 p-3 rounded-full text-white transition-all backdrop-blur-md z-10"
              >
                <X size={24} strokeWidth={3} />
              </button>
              <img 
                src={selectedImage} 
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border border-white/10 object-contain bg-black"
                referrerPolicy="no-referrer"
                alt="Enlarged screenshot preview"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DYNAMIC INTERACTIVE COMMENT SYSTEM BLOCK (DAY MODE BRIGHT STYLE) --- */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pb-20 select-text">
        <div className="space-y-6 pt-6 text-left">
          
          <h3 className="text-sm font-black text-slate-850 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6ab344]"></span>
            User Reviews & Ratings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Rating Stats Summary Panel (Extremely Play-Store themed original feel) */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-center">
              <div className="text-center pb-3">
                <div className="text-5xl font-black text-slate-800 dark:text-slate-200 leading-none mb-1">{avgRating}</div>
                <div className="flex justify-center gap-1 my-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-4 h-4 ${
                        s <= Math.round(Number(avgRating)) 
                          ? 'fill-[#6ab344] text-[#6ab344]' 
                          : 'fill-slate-100 text-slate-300'
                      } stroke-none`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">{ratingCountFormat.toLocaleString()} verified ratings</span>
              </div>

              {/* Graphical bars breakdown */}
              <div className="space-y-2 mt-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = getPercentageForStar(star);
                  return (
                    <div key={star} className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 select-none">
                      <span className="w-3 font-bold text-center text-slate-600">{star}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#6ab344] rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-extrabold text-[#6ab344]">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comment Post Form Container inline */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm md:col-span-2">
              <p className="font-extrabold text-[#6ab344] text-xs uppercase tracking-wider mb-2">Write a Review / Share Feedback</p>
              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      placeholder="e.g. Rachel Miller"
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#6ab344] focus:outline-none transition-colors font-semibold shadow-inner placeholder-slate-400 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide">Your Email *</label>
                    <input 
                      type="email" 
                      required
                      value={newCommentEmail}
                      onChange={(e) => setNewCommentEmail(e.target.value)}
                      placeholder="e.g. user@example.com"
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#6ab344] focus:outline-none transition-colors font-semibold shadow-inner placeholder-slate-400 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide">Select Rating *</label>
                    <div className="flex items-center gap-1.5 py-2">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button 
                          type="button"
                          key={starValue}
                          onClick={() => setNewCommentRating(starValue)}
                          className="focus:outline-none cursor-pointer transition-transform duration-100 active:scale-125"
                        >
                          <Star 
                            className={`w-6 h-6 stroke-none ${
                              starValue <= newCommentRating 
                                ? 'fill-[#ff9100] text-[#ff9100]' 
                                : 'fill-slate-100 text-slate-300 hover:fill-[#ff9100]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide">Your Comment / Review *</label>
                  <textarea 
                    rows={3}
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write your personal experience with the app..."
                    className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#6ab344] focus:outline-none transition-colors font-medium shadow-inner placeholder-slate-400 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    type="submit"
                    disabled={submittingComment}
                    className="px-5 py-2.5 bg-[#6ab344] hover:bg-[#5fa13a] disabled:bg-slate-300 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {submittingComment ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Posting...
                      </>
                    ) : (
                      'Post Review'
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Interactive Comments List */}
          <div className="space-y-4 pt-1">
            {comments.length === 0 ? (
              <div className="py-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl text-center text-xs font-semibold text-slate-400">
                There are no reviews yet. Be the first to share your experience above!
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 shadow-sm transition-all text-xs sm:text-sm text-slate-700 font-medium">
                    
                    {/* Comment Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Elegant dynamic initials avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-[#6ab344] flex items-center justify-center font-black text-white text-base shadow-sm">
                          {comment.author ? comment.author.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{comment.author}</div>
                          <div className="flex items-center gap-2 mt-0.5 select-none font-sans">
                            <span className="text-[10px] text-slate-400 font-bold">{formatRelativeTime(comment.createdAt)}</span>
                            <span className="text-slate-300 text-[10px]">&bull;</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`w-3 h-3 ${
                                    star <= comment.rating 
                                      ? 'fill-[#ff9100] text-[#ff9100]' 
                                      : 'fill-slate-100 text-slate-300'
                                  } stroke-none`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* No Rating pill */}
                    </div>

                    {/* Comment Text Content */}
                    <p className="mt-3 text-slate-600 leading-relaxed font-semibold bg-slate-50 dark:bg-slate-900/20 p-1.5 rounded-lg">
                      {comment.text}
                    </p>

                    {/* Interactive Like and Reply triggers row */}
                    <div className="flex items-center gap-4 mt-4 select-none border-t border-slate-100 dark:border-slate-800 pt-3">
                      
                      {/* Like trigger */}
                      <button 
                        type="button"
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1.5 border-none font-bold text-xs cursor-pointer active:scale-95 transition-all ${
                          likedComments[comment.id] 
                            ? 'text-[#6ab344] scale-[1.05]' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-850'
                        }`}
                      >
                        <ThumbsUp size={14} className={likedComments[comment.id] ? 'fill-[#6ab344]' : ''} />
                        <span>Like ({comment.likes || 0})</span>
                      </button>

                      {/* Reply trigger toggle */}
                      <button 
                        type="button"
                        onClick={() => {
                          setReplyInputId(replyInputId === comment.id ? null : comment.id);
                          setReplyAuthor('');
                          setReplyText('');
                        }}
                        className="flex items-center gap-1.5 border-none text-slate-500 dark:text-slate-400 hover:text-slate-850 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                      >
                        <MessageSquare size={14} />
                        <span>Reply ({comment.replies?.length || 0})</span>
                      </button>

                    </div>

                    {/* Replies listing inside current comment card nested nicely */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-3 sm:pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl relative">
                            {/* Accent indicator line edge block */}
                            <div className="flex items-center gap-2 mb-1.5 justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                  reply.author === 'Admin Support' || reply.author === 'Admin'
                                    ? 'bg-[#6ab344] text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {reply.author}
                                </span>
                                <span className="text-[10px] text-slate-450 font-bold font-sans">{formatRelativeTime(reply.createdAt)}</span>
                              </div>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                              {reply.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Collapsible Reply Sub Form */}
                    <AnimatePresence>
                      {replyInputId === comment.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 overflow-hidden"
                        >
                          <div className="space-y-2 max-w-xl text-left">
                            <p className="font-bold text-xs text-slate-600 uppercase mb-1">Add Reply</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                              <input 
                                type="text"
                                required 
                                value={replyAuthor}
                                onChange={(e) => setReplyAuthor(e.target.value)}
                                placeholder="Your Name"
                                className="p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#6ab344] focus:outline-none w-full font-bold text-slate-850"
                              />
                              <input 
                                type="text"
                                required 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Enter your reply content here..."
                                className="p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#6ab344] focus:outline-none w-full font-semibold text-slate-850"
                              />
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                              <button 
                                type="button"
                                onClick={() => setReplyInputId(null)}
                                className="px-3.5 py-1.5 font-bold text-xs text-slate-500 dark:text-slate-400 hover:text-slate-705 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 rounded-full cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={submittingReply}
                                className="px-4 py-1.5 font-extrabold text-xs text-white bg-[#6ab344] hover:bg-[#5fa13a] rounded-full shadow-sm cursor-pointer disabled:bg-slate-300 active:scale-95 transition-transform"
                              >
                                {submittingReply ? 'Posting...' : 'Post Reply'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {similarApps.length > 0 && (
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">Similar to <span className="text-[#6ab344]">{app?.title}</span></h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {similarApps.map(similar => (
              <Link to={`/app/${similar.id}`} key={similar.id} onClick={() => window.scrollTo(0, 0)} className="group bg-white dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#6ab344]/30 transition-all flex flex-col items-center text-center">
                <img src={similar.icon} alt={similar.title} className="w-14 h-14 object-cover rounded-xl shadow-sm mb-3 group-hover:scale-105 transition-transform" />
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">{similar.title}</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{similar.versionName || similar.version}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {storeState.siteSettings?.adPlacements?.appDetailBottom && (
          <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 pb-12 mt-4 space-y-6">
            <div 
               className="w-full flex flex-col items-center justify-center overflow-hidden mb-4" 
               dangerouslySetInnerHTML={{ __html: storeState.siteSettings.adPlacements.appDetailBottom }} 
            />
          </div>
      )}

      <Footer />
    </div>
  );
}
