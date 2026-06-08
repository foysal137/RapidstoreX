import { Menu, Search, User, Zap, X, ArrowLeft, Facebook, Twitter, Instagram, Youtube, Sun, Moon, Home, LayoutGrid, Gamepad2, Newspaper, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { getStoreState, getCurrentUser, UserSession } from '../data';
import { useTheme } from '../App';

export function TopBar({ showBack = false }: { showBack?: boolean }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  return (
    <>
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800">
      {/* Main Navigation Layer */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-6">
          <button onClick={() => setMenuOpen(true)} className="p-1 md:hidden text-gray-400 dark:text-gray-200">
            <Menu className="w-7 h-7" />
          </button>
          
          <Link to="/" className="cursor-pointer">
            <h1 className="text-[24px] md:text-[28px] font-black tracking-tight leading-none text-lite">
               RapidAPK
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
           <NavLink to="/" end className={({isActive}) => `flex items-center gap-2 text-[13px] font-bold transition-all uppercase tracking-wide px-4 py-2 rounded-full ${isActive ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-900'}`}>
             <Home className="w-4 h-4 mb-0.5" /> Home
           </NavLink>
           <NavLink to="/apps" className={({isActive}) => `flex items-center gap-2 text-[13px] font-bold transition-all uppercase tracking-wide px-4 py-2 rounded-full ${isActive ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-900'}`}>
             <LayoutGrid className="w-4 h-4 mb-0.5" /> Apps
           </NavLink>
           <NavLink to="/games" className={({isActive}) => `flex items-center gap-2 text-[13px] font-bold transition-all uppercase tracking-wide px-4 py-2 rounded-full ${isActive ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-900'}`}>
             <Gamepad2 className="w-4 h-4 mb-0.5" /> Games
           </NavLink>
           <NavLink to="/news" className={({isActive}) => `flex items-center gap-2 text-[13px] font-bold transition-all uppercase tracking-wide px-4 py-2 rounded-full ${isActive ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-900'}`}>
             <Newspaper className="w-4 h-4 mb-0.5" /> News
           </NavLink>
           <NavLink to="/browse" className={({isActive}) => `flex items-center gap-2 text-[13px] font-bold transition-all uppercase tracking-wide px-4 py-2 rounded-full ${isActive ? 'bg-[#8cc63f]/10 text-[#8cc63f]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-900'}`}>
             <Compass className="w-4 h-4 mb-0.5" /> Browse
           </NavLink>
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/search" className="p-2 text-gray-400 dark:text-gray-200">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </header>

    {menuOpen && (
      <div className="fixed inset-0 z-[100] flex">
        <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
        <div className="relative w-[280px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
          {/* ... (rest of the menu content needs to be updated with isDarkMode check) ... */}
          <div className="p-6 bg-lite text-white flex items-center gap-4">
             <div className="w-12 h-12 bg-white dark:bg-slate-950/20 rounded-2xl flex items-center justify-center">
                <Zap className="text-lite dark:text-white fill-lite dark:fill-white" size={24} />
             </div>
             <div>
                <h3 className="font-black text-xl leading-none">RAPIDAPK</h3>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-6 py-3 font-bold text-gray-800 dark:text-gray-200 hover:text-lite cursor-pointer flex items-center gap-4 group transition-colors" onClick={() => {setMenuOpen(false); navigate('/');}}>
               <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-lite" /> Home
            </div>
            {getStoreState().headerTags.map((tag) => (
              <div 
                key={tag} 
                className="px-6 py-3 font-bold text-gray-800 dark:text-gray-200 hover:text-lite cursor-pointer flex items-center gap-4 group transition-colors uppercase text-sm" 
                onClick={() => {setMenuOpen(false); navigate(`/category/${tag.toLowerCase()}`);}}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-lite" /> {tag}
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-50">
               <div className="px-6 py-3 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Theme</div>
               <div className="px-6 py-3 font-bold text-gray-800 dark:text-gray-200 hover:text-lite cursor-pointer flex items-center gap-4 group transition-colors" onClick={() => {setMenuOpen(false); toggleDarkMode();}}>
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-lite" />
                 {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 dark:border-slate-800 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
             © 2026 RapidAPK
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export function PromoBanner() {
  const navigate = useNavigate();
  const state = getStoreState();
  const promo = state.siteSettings.promoBanner;
  
  if (!promo.enabled) return null;
  
  // Find linked app to show its real icon
  const allApps = [
    ...state.heroBanners,
    ...state.mmorpgApps,
    ...state.latestUpdates,
    ...state.newReleases,
    ...state.worldCupApps,
    ...state.topDownloads
  ];
  const linkedApp = allApps.find(a => a.id === promo.appId);
  const displayIcon = linkedApp?.icon || linkedApp?.image || "";
  
  return (
    <div className="px-5 py-6 w-full cursor-pointer hover:opacity-95 transition-all group" onClick={() => navigate(promo.appId ? `/app/${promo.appId}` : '/')}>
      <div className="w-full rounded-[2.5rem] overflow-hidden relative shadow-[0_20px_50px_rgb(0,0,0,0.12)] bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700 p-7 sm:p-9 flex items-center gap-6">
        
        <div className="flex-1 text-white pr-2 z-10 relative">
           <div className="flex items-center gap-2 mb-4">
             <span className="bg-white/20 dark:bg-slate-950/20 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md border border-white/10 shrink-0">
               {promo.tagText || 'VERIFIED'}
             </span>
             {linkedApp && (
               <span className="text-[10px] text-indigo-100 font-bold uppercase tracking-tight opacity-80 truncate max-w-[120px]">
                 Linked: {linkedApp.title}
               </span>
             )}
           </div>
           
           <h3 className="font-black text-2xl sm:text-3xl leading-[1.1] mb-3 tracking-tight" dangerouslySetInnerHTML={{ __html: promo.title }}></h3>
           <p className="text-indigo-50/80 text-xs sm:text-sm font-medium leading-relaxed max-w-[240px] mb-6">{promo.subtitle}</p>
           
           <div className="flex items-center gap-4">
             <button className="bg-white dark:bg-slate-950 text-indigo-600 text-xs font-black px-6 py-3 rounded-full shadow-xl shadow-indigo-900/20 active:scale-95 transition-all hover:bg-gray-50 dark:bg-slate-900 flex items-center gap-2 group-hover:gap-3">
               {promo.buttonText} <Zap size={14} className="fill-current" />
             </button>
           </div>
         </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white dark:bg-slate-950/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl rotate-6 group-hover:rotate-0 transition-all duration-700 overflow-hidden p-3 shrink-0">
           {displayIcon ? (
             <img 
               src={displayIcon} 
               alt="promo icon" 
               className="w-full h-full object-contain rounded-2xl shadow-inner bg-white dark:bg-slate-950/5" 
               referrerPolicy="no-referrer"
             />
           ) : (
             <div className="w-16 h-16 flex flex-col items-center justify-center text-white relative shadow-sm opacity-40">
               <div className="w-8 h-8 border-b-4 border-l-4 border-white transform -rotate-45 relative top-1"></div>
               <div className="absolute bottom-[4px] w-[45px] h-[6px] bg-white dark:bg-slate-950 rounded-full"></div>
             </div>
           )}
           
           {/* Glass reflection effect */}
           <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Abstract shapes for premium depth */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white dark:bg-slate-950/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      </div>
    </div>
  );
}

export function Footer() {
  const state = getStoreState();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-slate-800/80 text-slate-400 pt-16 pb-32 mt-12 w-full overflow-hidden">
      {/* Decorative Radial Backdrop Glimmer */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 md:gap-16 pb-12 border-b border-slate-800/60">
          
          {/* Logo Column */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.25)] flex items-center justify-center overflow-hidden">
                <div className="w-4 h-4 bg-white dark:bg-slate-950 rounded-[2px] transform rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                {state.siteSettings.title}
              </span>
            </div>
            
            <p className="text-[14px] leading-relaxed font-medium text-slate-400/90 pr-4">
              {state.siteSettings.description}
            </p>

            <div className="flex gap-3 pt-3">
              <a 
                href={state.socialLinks.facebook} 
                target="_blank" 
                rel="noreferrer" 
                title="Facebook" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-slate-400 hover:shadow-lg hover:shadow-blue-600/20"
              >
                <Facebook className="w-[18px] h-[18px]" />
              </a>
              <a 
                href={state.socialLinks.twitter} 
                target="_blank" 
                rel="noreferrer" 
                title="Twitter" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-750 hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-slate-400 hover:shadow-lg hover:shadow-slate-800/25"
              >
                <Twitter className="w-[18px] h-[18px]" />
              </a>
              <a 
                href={state.socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer" 
                title="Instagram" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-slate-400 hover:shadow-lg hover:shadow-pink-600/20"
              >
                <Instagram className="w-[18px] h-[18px]" />
              </a>
              <a 
                href={state.socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer" 
                title="YouTube" 
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-650 hover:border-red-600 hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center justify-center text-slate-400 hover:shadow-lg hover:shadow-red-650/20"
              >
                <Youtube className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-wider pl-0.5 border-l-2 border-blue-500 ml-0.5">Menu</h4>
            <ul className="space-y-3.5 text-[13px] font-semibold mt-3">
              <li>
                <Link to="/games" className="hover:text-white transition-all duration-200 block uppercase text-xs tracking-wider hover:translate-x-1.5 transform">
                  GAMES
                </Link>
              </li>
              <li>
                <Link to="/apps" className="hover:text-white transition-all duration-200 block uppercase text-xs tracking-wider hover:translate-x-1.5 transform">
                  APPS
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-white transition-all duration-200 block uppercase text-xs tracking-wider hover:translate-x-1.5 transform">
                  NEW RELEASES
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-all duration-200 block uppercase text-xs tracking-wider hover:translate-x-1.5 transform">
                  TOP DOWNLOADS
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-wider pl-0.5 border-l-2 border-indigo-500 ml-0.5">Information Guidelines</h4>
            <ul className="space-y-3.5 text-[13px] font-semibold mt-3">
              <li>
                <Link to="/info/about-us" className="hover:text-white hover:translate-x-1.5 transform transition-all duration-200 block">About Us</Link>
              </li>
              <li>
                <Link to="/info/about-appstore" className="hover:text-white hover:translate-x-1.5 transform transition-all duration-200 block">About RapidAPK</Link>
              </li>
              <li>
                <Link to="/info/editorial-policy" className="hover:text-white hover:translate-x-1.5 transform transition-all duration-200 block">Editorial Policy</Link>
              </li>
              <li>
                <Link to="/info/transparency" className="hover:text-white hover:translate-x-1.5 transform transition-all duration-200 block">Transparency Center</Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-black uppercase tracking-wider pl-0.5 border-l-2 border-emerald-500 ml-0.5">Services</h4>
            <ul className="space-y-3.5 text-[13px] font-semibold mt-3">
              <li>
                <Link to="/info/publish" className="hover:text-white hover:translate-x-1.5 transform transition-all duration-200 block">Publish your app</Link>
              </li>
              <li>
                <Link to="/info/promote" className="hover:text-blue-400 hover:text-indigo-400 font-bold flex items-center gap-1.5 hover:translate-x-1.5 transform transition-all duration-200 text-indigo-400">
                  Promote app <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-black">PRO</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright and Legal Section */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs font-medium text-slate-500 dark:text-slate-400 font-semibold">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p>© {currentYear} {state.siteSettings.title}. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6 font-semibold">
            <Link to="/info/editorial-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/info/transparency" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
