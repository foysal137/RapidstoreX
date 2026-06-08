import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '../components/Shared';
import { getAllApps, getCurrentUser, setCurrentUser, registerUser, loginUser, UserSession } from '../data';
import { Search as SearchIcon, User, Settings, ArrowRight, LogOut, CheckCircle2, ShieldAlert, Sparkles, Send, Database, Trophy } from 'lucide-react';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const allApps = getAllApps();
  const results = query ? allApps.filter(app => (app.title || '').toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
       <TopBar showBack />
       <div className="p-5">
         <div className="bg-white dark:bg-slate-950 rounded-[1.5rem] flex items-center px-5 py-4 mb-8 border border-gray-100 dark:border-slate-800 focus-within:border-blue-400 focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.1)] transition-all shadow-sm">
            <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Games, Apps, and more..."
              className="bg-transparent border-none outline-none flex-1 text-[15px] font-bold text-gray-800 dark:text-gray-200 placeholder-gray-400"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
         </div>
         <div>
            <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 mb-5">{query ? 'Results' : 'Suggested search'}</h3>
            <div className="flex flex-col gap-3">
               {(query ? results : allApps.slice(0, 5)).map(app => (
                  <div key={app.id} onClick={() => navigate(`/app/${app.id}`)} className="flex items-center gap-4 cursor-pointer bg-white dark:bg-slate-950 p-3 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-gray-50 hover:shadow-md transition-all group">
                     <img src={app.icon || app.image} className="w-[60px] h-[60px] rounded-[1.25rem] object-cover bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-1 group-hover:border-blue-100 transition-colors" />
                     <div className="flex-1">
                        <h4 className="font-bold text-[15px] text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 transition-colors">{app.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 font-medium">{app.subtitle || 'AppStore Content'}</p>
                     </div>
                  </div>
               ))}
               {query && results.length === 0 && (
                  <div className="bg-white dark:bg-slate-950 rounded-3xl p-10 text-center shadow-sm border border-gray-100 dark:border-slate-800 mt-6">
                    <SearchIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100">No results found</p>
                    <p className="text-sm text-gray-500 font-medium">Try different keywords for "{query}"</p>
                  </div>
               )}
            </div>
         </div>
       </div>
    </div>
  );
}

export function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const allApps = getAllApps();
  
  const catParam = (name || '').toLowerCase();

  useEffect(() => {
    document.title = `Download Free ${name} Apps and Games - RapidAPK`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", `Download the best free ${name} Android apps and games safely on RapidAPK.`);
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", `${name}, android apps, download apps, free android apps, best apps, apk`);
  }, [name]);
  
  // Filter apps matching the category slug, title or tags
  const filteredApps = allApps.filter(app => {
    const appCat = (app.category || '').toLowerCase();
    const appTag = (app.tag || '').toLowerCase();
    const appTitle = (app.title || '').toLowerCase();
    
    // Exact or partial category match
    if (appCat.includes(catParam) || catParam.includes(appCat)) return true;
    if (appTag.includes(catParam) || catParam.includes(appTag)) return true;
    if (appTitle.includes(catParam)) return true;
    
    // Special groupings mapping
    if (catParam.includes('game') && appCat === 'games') return true;
    if (catParam.includes('app') && appCat === 'apps') return true;
    
    return false;
  });

  // Safe fallback to all apps to ensure no blank screens for newly created empty categories
  const displayApps = filteredApps.length > 0 ? filteredApps : allApps;
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />
      <div className="bg-gradient-to-br from-gray-900 to-slate-800 text-white py-10 px-6 shadow-inner relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <h2 className="text-4xl font-black capitalize relative z-10">{name}</h2>
         <p className="text-[15px] text-gray-300 font-medium mt-2 relative z-10">Explore the best selections</p>
      </div>
      <div className="px-5 py-6 flex-1 bg-gray-50 dark:bg-slate-900">
         <div className="flex flex-col gap-4">
           {displayApps.map(app => (
             <div 
               key={app.id} 
               onClick={() => navigate(`/app/${app.id}`)} 
               className="flex items-center gap-4 cursor-pointer group bg-white dark:bg-slate-950 p-4 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
             >
               <div className="w-16 h-16 rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-1.5 overflow-hidden group-hover:border-blue-200 transition-colors shrink-0 shadow-inner">
                 <img src={app.icon || app.image} className="w-full h-full object-contain rounded-xl" referrerPolicy="no-referrer" />
               </div>
               <div className="flex-1 min-w-0">
                 <h4 className="font-bold text-base text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors tracking-tight">
                   {app.title}
                 </h4>
                 <p className="text-[11px] text-gray-400 font-extrabold uppercase mt-0.5 tracking-wider">
                   {app.developerName || app.developer || 'AppStore Developer'}
                 </p>
                 <div className="flex items-center gap-2 mt-1.5">
                   <div className="flex items-center text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-black">
                     ★ {app.rating || '4.5'}
                   </div>
                   <div className="text-[10px] text-gray-400 font-bold border-l border-gray-200 dark:border-slate-700 pl-2">
                     {app.downloads || '10M+'} Downloads
                   </div>
                 </div>
               </div>
               <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ArrowRight size={20} strokeWidth={3} />
               </div>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const [currentUser, setCurrentUserLocal] = useState<UserSession | null>(getCurrentUser());
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [feedback, setFeedback] = useState({ error: '', success: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthEvent = () => {
      setCurrentUserLocal(getCurrentUser());
    };
    window.addEventListener("appstore_auth_update", handleAuthEvent);
    return () => window.removeEventListener("appstore_auth_update", handleAuthEvent);
  }, []);

  const handlePageAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ error: '', success: '' });

    if (!emailInput.trim()) {
      setFeedback({ error: 'Please enter your email.', success: '' });
      return;
    }

    if (authMode === 'signup') {
      if (!nameInput.trim()) {
        setFeedback({ error: 'Please enter your name.', success: '' });
        return;
      }
      const result = registerUser(nameInput, emailInput);
      if (typeof result === 'string') {
        setFeedback({ error: result, success: '' });
      } else {
        setFeedback({ error: '', success: `Welcome ${result.name}! Registered successfully.` });
        setNameInput('');
        setEmailInput('');
      }
    } else {
      const result = loginUser(emailInput);
      if (typeof result === 'string') {
        setFeedback({ error: result, success: '' });
      } else {
        setFeedback({ error: '', success: `Welcome back, ${result.name}!` });
        setEmailInput('');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setFeedback({ error: '', success: 'Logged out successfully.' });
  };

  // Pull developer-submitted apps to show dynamic list
  const submissions = JSON.parse(localStorage.getItem('appstore_publisher_submissions') || '[]');
  const userSubmissions = submissions.filter((s: any) => s.submittedBy === currentUser?.email || s.developer === currentUser?.name);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />
      
      {currentUser ? (
        // Authenticated Dashboard
        <div className="flex-1 p-5">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-[2.25rem] shadow-[0_12px_30px_rgba(15,23,42,0.15)] relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-[68px] h-[68px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black uppercase tracking-tight">{currentUser.name}</h2>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-extrabold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium break-all mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-center relative z-10">
              <div>
                <span className="block text-xl font-black text-white">{userSubmissions.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Submissions</span>
              </div>
              <div className="border-x border-slate-800/85">
                <span className="block text-xl font-black text-emerald-400">100%</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Passing Rate</span>
              </div>
              <div>
                <span className="block text-xl font-black text-indigo-300">Active</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Developer</span>
              </div>
            </div>
          </div>

          {/* Play Console overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[11px] text-gray-500 uppercase tracking-widest pl-1">PLAY CONSOLE DEV STUDIO</h3>
            </div>

            {/* Quick Action links */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => navigate('/info/publish')}
                className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-300 transition-all group hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2.5 border border-blue-100">
                  <Send className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">SUBMIT NEW APP</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight font-medium">Deploy packages straight to rollout channels.</p>
              </div>

              <div 
                onClick={() => navigate('/cp-page0')}
                className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-violet-300 transition-all group hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-2.5 border border-violet-100">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-xs text-gray-900 dark:text-gray-100 group-hover:text-violet-600 transition-colors">STORE ADMIN PANEL</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight font-medium">Control live apps, categorizations, and settings.</p>
              </div>
            </div>

            {/* Submissions Section */}
            <div className="bg-white dark:bg-slate-950 rounded-3xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4 border-b border-gray-50 pb-2">Your App Catalog Releases</span>
              
              {userSubmissions.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200">Your App Store is Empty</p>
                  <p className="text-[10px] text-gray-400 font-semibold px-4 mt-1">Get started by uploading and releasing your first Android APK Package!</p>
                  <button 
                    onClick={() => navigate('/info/publish')}
                    className="mt-4 bg-blue-600 text-white font-black text-[10px] px-4 py-2 rounded-full uppercase shadow-md active:scale-95 transition-all"
                  >
                    Submit App Package
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userSubmissions.map((sub: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-2.5 rounded-2xl border border-gray-100 dark:border-slate-800">
                      <img src={sub.icon || "https://api.dicebear.com/7.x/shapes/svg?seed=subdef"} className="w-11 h-11 object-cover rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-700" />
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-black text-gray-900 dark:text-gray-100 truncate leading-snug">{sub.title}</span>
                        <div className="flex gap-1.5 items-center mt-0.5">
                          <span className="text-[9px] bg-slate-200/65 font-bold px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 font-mono uppercase truncate max-w-[100px]">{sub.packageName}</span>
                          <span className="text-[9px] text-gray-400 font-semibold font-mono">v{sub.versionName || '1.0'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block text-center">Live</span>
                        <span className="text-[8px] text-gray-400 font-semibold block mt-0.5">Checked</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Buttons */}
            <button 
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3.5 rounded-2xl font-black text-xs transition-colors flex items-center justify-center gap-2 mt-6 uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" /> Log Out Developer Profile
            </button>
          </div>
        </div>
      ) : (
        // Play-Console Styled Credentials Switcher Page (Logged out)
        <div className="flex-1 p-5 flex flex-col items-center justify-center min-h-[550px]">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 border border-blue-100 shadow-inner">
            <User className="w-8 h-8" />
          </div>
          
          <div className="text-center max-w-sm mb-6">
            <h2 className="text-2xl font-black text-gray-950 tracking-tight uppercase leading-none">Developer Console</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1.5 leading-relaxed">
              Log in or register for a developer account to publish and manage your applications.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl w-full max-w-sm space-y-3.5 text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Account Access</p>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              Log In
            </button>

            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-black text-xs py-3.5 rounded-2xl transition-all active:scale-95 uppercase tracking-wider"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
