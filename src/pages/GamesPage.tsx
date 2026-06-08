import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getAllApps, getNumericDownloads, GAME_CATEGORIES, formatPlayStoreDownloads, isPremiumApp, getStoreState } from '../data';
import { Crown, ArrowRight, LayoutGrid, List, ArrowDownToLine, ChevronLeft, ChevronRight, SlidersHorizontal, Trophy } from 'lucide-react';
import { getAppTags } from '../components/StoreUI';

export default function GamesPage() {
  const navigate = useNavigate();
  const storeState = getStoreState();
  
  // Games data lists
  const [allGames, setAllGames] = useState<any[]>([]);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [topGames, setTopGames] = useState<any[]>([]);
  
  // Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'rating'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Games category/genre tags
  const gameTags = [
    'All',
    ...GAME_CATEGORIES
  ];

  useEffect(() => {
    document.title = "Download Free Android Games - RapidAPK";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", "Find and download the best free Android games rapidly and securely on RapidAPK.");
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "android games, download games, free android games, best games, apk");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const all = getAllApps();
    
    // Categorize as games (explicit category is games, or tag indicates typical gaming terms)
    const gamesList = all.filter(app => {
      const isGames = app.category === 'games';
      return isGames;
    });
    
    setAllGames(gamesList);
    
    // Extract "Top Games" - sorted by score of downloads and rating
    const sortedForTop = [...gamesList].sort((a, b) => {
      const bScore = (getNumericDownloads(b.downloads) * 2) + (parseFloat(b.rating) || 0) * 1000000;
      const aScore = (getNumericDownloads(a.downloads) * 2) + (parseFloat(a.rating) || 0) * 1000000;
      return bScore - aScore;
    });
    
    // Top 6 are featured
    setTopGames(sortedForTop.slice(0, 6));
  }, []);

  // Filter and sort items
  useEffect(() => {
    let result = [...allGames];

    // Filter by tag
    if (selectedTag !== 'All') {
      result = result.filter(app => (app.tag || "").toLowerCase() === selectedTag.toLowerCase());
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(app => 
        (app.title || "").toLowerCase().includes(query) || 
        (app.subtitle || "").toLowerCase().includes(query) ||
        (app.tag || "").toLowerCase().includes(query)
      );
    }

    // Sort by selected parameter
    if (sortBy === 'popular') {
      result.sort((a, b) => getNumericDownloads(b.downloads) - getNumericDownloads(a.downloads));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    } else if (sortBy === 'newest') {
      // Fallback sorting
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    setFilteredGames(result);
    setCurrentPage(1); // Reset to page 1 on filter
  }, [allGames, selectedTag, searchQuery, sortBy]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGames.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage) || 1;

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Smooth scroll to the main section
      const contentSection = document.getElementById('games-explore-section');
      if (contentSection) {
        contentSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />
      
      {/* Search & Hero Header Banner */}
      <div className="bg-[#0f172a] text-white py-12 px-6 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-[10px] font-black uppercase tracking-widest mb-3">
              Pure Unlocked Gaming Portal
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-3">
              Android <span className="text-lite">Games</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-[480px] leading-relaxed font-medium">
              Discover verified games with custom cheat menus, infinite resources, fully unlocked expansion packs, and direct high-speed transfers.
            </p>
          </div>

          <div className="w-full md:w-96">
            <div className="relative bg-white/10 dark:bg-slate-950/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/15 shadow-2xl flex items-center">
              <input
                type="text"
                placeholder="Search premium games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none font-bold"
              />
              <button className="bg-lite text-white px-5 py-3 rounded-xl hover:bg-opacity-95 text-xs font-black tracking-wider shadow-lg flex items-center gap-1 shrink-0">
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 👑 Top Games Section */}
      {topGames.length > 0 && (
        <section className="bg-white dark:bg-slate-950 py-8 border-b border-gray-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shadow-sm">
                <Crown size={18} className="text-amber-500 fill-amber-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-[22px] tracking-tight text-gray-900 dark:text-gray-100 leading-none">Top Games</h3>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">Highly-Rated by Importer</p>
              </div>
            </div>

            {/* Horizontal Swipeable Cards container */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
              {topGames.map((app) => {
                return (
                  <div 
                    key={app.id}
                    onClick={() => navigate(`/app/${app.id}`)}
                    className="w-[110px] sm:w-[130px] group cursor-pointer flex flex-col gap-2 transition-all duration-300 flex-none"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 shadow-sm flex items-center justify-center group-hover:scale-[1.03] transition-transform">
                      <img 
                        src={app.icon} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        alt={app.title}
                      />
                      <div className="absolute bottom-1.5 left-1.5 flex flex-col z-10 w-full mb-1">
                         <span className="text-[6px] font-black text-white px-1 py-0.5 rounded-sm bg-[#db7f36] shadow-sm uppercase tracking-wider w-fit">
                           Editor's Choice
                         </span>
                         <span className="bg-[#8cc63f] text-white text-[6px] font-black px-1.5 py-0.5 mt-[1px] w-fit rounded-sm shadow-sm">{isPremiumApp(app) ? "MOD" : "ONLINE"}</span>
                      </div>
                    </div>

                    <div className="min-w-0 px-1">
                      <h4 className="font-bold text-[13px] text-gray-900 dark:text-gray-100 truncate group-hover:text-lite transition-colors leading-tight">
                        {app.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                        {app.subtitle || app.tag || 'Game'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Exploration Section */}
      <section id="games-explore-section" className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-8 flex-1">
        
        {/* Genre Pill Selection Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {gameTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 text-xs font-black tracking-wide rounded-full border transition-all shrink-0 uppercase ${
                  isActive
                    ? 'bg-lite text-white border-lite shadow-md shadow-emerald-600/10 scale-105'
                    : 'bg-white dark:bg-slate-950 text-gray-500 border-gray-200 dark:border-slate-700 hover:border-lite hover:text-lite'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* List Controls / Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-5 border-t border-gray-200 dark:border-slate-700/60 mt-4 mb-4">
          <div>
            <h3 className="font-extrabold text-[20px] text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
              Games 
              <span className="text-xs font-black bg-gray-200/70 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full uppercase">
                {filteredGames.length.toLocaleString()}
              </span>
            </h3>
            <p className="text-[12px] text-gray-500 font-medium mt-1">
              Tens of thousands of different modded games, from old to the newest. You can find cool mods and features for your favorite games here. Easy installation with a single APK file.
            </p>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-end shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs font-bold uppercase hidden md:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-lite hover:border-lite cursor-pointer"
              >
                <option value="popular">Newest</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Promo Ad Banner from image 2 */}
        {storeState.siteSettings?.adPlacements?.gamesPage ? (
          <div 
             className="w-full flex flex-col items-center justify-center mb-6 max-w-2xl mx-auto overflow-hidden" 
             dangerouslySetInnerHTML={{ __html: storeState.siteSettings.adPlacements.gamesPage }} 
          />
        ) : (
          <div className="w-full bg-[#eeeeee] flex flex-col items-center justify-center p-8 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-slate-800 max-w-2xl mx-auto h-[200px]">
             <span className="text-sm font-bold text-gray-500 mt-auto bg-white dark:bg-slate-950/50 px-4 py-1.5 backdrop-blur-sm rounded-lg mb-2">Unlock the Impossible (Placeholder)</span>
          </div>
        )}

        <div className="flex items-center justify-start mb-6">
            {/* Layout Mode Button Toggles */}
            <div className="bg-[#f8f9fa] border border-gray-200 dark:border-slate-700 rounded-xl p-1 flex items-center shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-lite text-white shadow-sm' 
                    : 'text-gray-400 hover:text-lite'
                }`}
                title="Grid Layout"
              >
                <LayoutGrid size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-[#e5e7eb] text-gray-600 dark:text-gray-400 shadow-sm' 
                    : 'text-gray-400 hover:text-lite'
                }`}
                title="List Layout"
              >
                <List size={16} strokeWidth={2.5} />
              </button>
            </div>
        </div>

        {/* Empty State warning */}
        {currentItems.length === 0 && (
          <div className="bg-white dark:bg-slate-950 border border-gray-150 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto mt-6">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal size={24} />
            </div>
            <h4 className="font-black text-lg text-slate-800 dark:text-slate-200 tracking-tight">No Games Found</h4>
            <p className="text-slate-400 text-xs mt-2 font-medium max-w-[340px] mx-auto leading-relaxed">
              We couldn't find any premium games matching "{searchQuery}" or the "{selectedTag}" category. Try adjusting your filters.
            </p>
            <button 
              onClick={() => { setSelectedTag('All'); setSearchQuery(''); }}
              className="mt-6 bg-lite text-white text-xs font-black px-6 py-3 rounded-full hover:bg-opacity-95 transition-all shadow-md active:scale-95 uppercase tracking-wide"
            >
              Reset Filters
            </button>
          </div>
        )}
        {/* Multi-Column Grid Layout */}
        {viewMode === 'grid' && currentItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {currentItems.map((app) => {
              return (
                <div 
                  key={app.id}
                  onClick={() => navigate(`/app/${app.id}`)}
                  className="bg-white dark:bg-slate-950 hover:bg-white dark:bg-slate-950 rounded-[20px] p-2.5 border border-gray-100 dark:border-slate-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-slate-200/50 hover:border-lite/40 transition-all duration-300 cursor-pointer flex flex-col group relative active:scale-[0.98] overflow-hidden"
                >
                  {/* Center icon container matches Image 2 grid */}
                  <div className="w-full aspect-square bg-[#f8f9fa] dark:bg-slate-900 border border-gray-100 dark:border-slate-800/50 rounded-[14px] overflow-hidden relative shadow-sm shrink-0 group-hover:border-lite/40 transition-colors flex items-center justify-center mb-2.5">
                    {/* Dynamic Overlay tags */}
                    <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1 z-10 max-w-[90%]">
                      {(!app.hasMod && app.tag && app.tag.toLowerCase().includes('paid')) && (
                        <span className="text-[7px] sm:text-[8px] tracking-widest uppercase font-black bg-[#db7f36] text-white px-1.5 py-0.5 rounded shadow-sm">
                          Paid
                        </span>
                      )}
                      {app.hasMod && (
                        <span className="text-[7px] sm:text-[8px] tracking-widest uppercase font-black bg-[#db7f36] text-white px-1.5 py-0.5 rounded shadow-sm">
                          MOD
                        </span>
                      )}
                      {isPremiumApp(app) && !app.hasMod && (
                        <span className="text-[7px] sm:text-[8px] tracking-widest uppercase font-black bg-[#6ab344] text-white px-1.5 py-0.5 rounded shadow-sm">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <img 
                      src={app.icon || app.image} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                      alt={app.title} 
                    />
                  </div>

                  {/* Content below centered icon */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between px-0.5">
                    <div>
                      <h4 className="font-bold text-[13px] text-gray-900 dark:text-gray-100 group-hover:text-lite transition-colors leading-[1.3] truncate">
                        {app.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-wide uppercase truncate">
                        v{app.version || '5.1'} &bull; {app.size || '16M'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-orange-500 truncate">
                      <span className="flex items-center gap-0.5 text-[#db7f36]"><Star size={10} className="fill-[#db7f36] text-[#db7f36]" /> {app.rating || '4.5'}</span>
                      <span className="text-gray-400 font-bold truncate flex-1 leading-none border-l border-gray-200 dark:border-slate-700 pl-1">
                        {app.tag || app.subtitle || 'Premium Unlocked'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Single-Column List Layout */}
        {viewMode === 'list' && currentItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {currentItems.map((app) => {
              return (
                <div 
                  key={app.id}
                  onClick={() => navigate(`/app/${app.id}`)}
                  className="flex items-center gap-4 cursor-pointer group bg-white dark:bg-slate-950 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-lite/30 hover:shadow-slate-100 transition-all active:scale-[0.99]"
                >
                  <div className="w-16 h-16 rounded-2xl border border-gray-100 dark:border-slate-800 bg-[#f8f9fa] p-1.5 overflow-hidden relative shrink-0 shadow-inner group-hover:border-lite/40 transition-colors flex items-center justify-center">
                    {/* PREMIUM badge at top left of icon */}
                    {isPremiumApp(app) && (
                      <span className="absolute top-1 left-1 text-[7px] font-black tracking-wide uppercase bg-[#6ab344] text-white px-1 py-0.5 rounded leading-none scale-90 z-10 shadow">
                        PREMIUM
                      </span>
                    )}
                    <img src={app.icon || app.image} className="w-[82%] h-[82%] object-contain rounded-[14px] bg-white dark:bg-slate-950 shadow-sm" referrerPolicy="no-referrer" alt={app.title} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate group-hover:text-lite transition-colors tracking-tight">
                      {app.title}
                    </h4>

                    <p className="text-[11px] text-gray-400 font-bold mt-0.5 tracking-tight truncate">
                      v{app.version || '5.1'} &bull; {app.size || '16M'}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] font-extrabold text-orange-500">
                      <span>★ {app.rating || '4.5'}</span>
                      <span className="text-gray-400 font-bold border-l border-gray-200 dark:border-slate-700 pl-1.5 ml-1.5 truncate">
                        {app.tag || app.subtitle || 'Premium Unlocked'}
                      </span>
                    </div>
                  </div>

                  {/* Green circular download icon button as specified */}
                  <div className="w-10 h-10 bg-[#6ab344] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 shadow-[0_4px_12px_rgba(106,179,68,0.25)]">
                    <ArrowDownToLine size={16} strokeWidth={3} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 👑 Professional Pagination Controls matching Screenshot 5 */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                currentPage === 1
                  ? 'border-gray-100 dark:border-slate-800 text-gray-300 cursor-not-allowed bg-gray-50 dark:bg-slate-900/50'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-lite hover:text-lite bg-white dark:bg-slate-950 hover:shadow-sm'
              }`}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Custom high fidelity numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Only display page 1, current page, neighbors, and last page with ellipsis
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full font-black text-xs transition-all border ${
                      isActive
                        ? 'bg-lite text-white border-lite shadow-md shadow-emerald-600/20'
                        : 'bg-white dark:bg-slate-950 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-lite hover:text-lite'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === 2 && currentPage > 3) || 
                (pageNum === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={pageNum} className="px-1 text-slate-400 font-bold text-xs">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                currentPage === totalPages
                  ? 'border-gray-100 dark:border-slate-800 text-gray-300 cursor-not-allowed bg-gray-50 dark:bg-slate-900/50'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-lite hover:text-lite bg-white dark:bg-slate-950 hover:shadow-sm'
              }`}
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}

      </section>

      <Footer />
    </div>
  );
}
