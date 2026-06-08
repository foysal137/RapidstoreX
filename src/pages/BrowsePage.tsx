import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getAllApps, getNumericDownloads, getStoreState, formatPlayStoreDownloads, isPremiumApp } from '../data';
import { 
  Search as SearchIcon, 
  Crown, 
  SlidersHorizontal, 
  RefreshCw, 
  LayoutGrid, 
  List, 
  ArrowDownToLine, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { getAppTags } from '../components/StoreUI';

export default function BrowsePage() {
  const navigate = useNavigate();
  const storeState = getStoreState();
  const [allApps, setAllApps] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);
  const [featuredDocs, setFeaturedDocs] = useState<any[]>([]);

  // Search & Filter Settings state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [appType, setAppType] = useState('All'); // 'All' | 'apps' | 'games'
  const [selectedCollection, setSelectedCollection] = useState('All'); // 'All' | 'latestUpdates' | 'newReleases' | 'mmorpgApps' | 'topDownloads'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'name'

  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Extract unique genres for picker options
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    document.title = "Search & Browse Android Apps and Games - RapidAPK";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", "Search, filter, and discover highly recommended Android applications and games securely on RapidAPK.");
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "search android apps, find apps, latest apks, apk directory, android library");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storeApps = getAllApps();
    setAllApps(storeApps);

    // Extract unique labels
    const genres = new Set<string>();
    storeApps.forEach(app => {
      if (app.tag) genres.add(app.tag);
    });
    setAvailableGenres(Array.from(genres));

    // Featured picks: rating >= 4.0 sorted
    const featured = [...storeApps]
      .filter(app => parseFloat(app.rating) >= 4.0)
      .sort((a, b) => getNumericDownloads(b.downloads) - getNumericDownloads(a.downloads))
      .slice(0, 6);
    setFeaturedDocs(featured);
  }, []);

  // Sync filtration logic
  useEffect(() => {
    let result = [...allApps];

    // Search input query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(app => 
        (app.title || '').toLowerCase().includes(q) ||
        (app.subtitle || '').toLowerCase().includes(q) ||
        (app.developer || '').toLowerCase().includes(q) ||
        (app.id || '').toLowerCase().includes(q)
      );
    }

    // Genre/Tag filtration
    if (selectedGenre !== 'All') {
      result = result.filter(app => (app.tag || '').toLowerCase() === selectedGenre.toLowerCase());
    }

    // App type category filtering
    if (appType !== 'All') {
      result = result.filter(app => {
        if (appType === 'apps') {
          return app.category === 'apps' || !app.category;
        } else {
          return app.category === 'games';
        }
      });
    }

    // Specific list collection filtration
    if (selectedCollection !== 'All') {
      const state = getStoreState();
      const colApps = state[selectedCollection as keyof typeof state] || [];
      const colIds = new Set((colApps as any[]).map(a => a.id));
      result = result.filter(app => colIds.has(app.id));
    }

    // Sort operations
    if (sortBy === 'popular') {
      result.sort((a, b) => getNumericDownloads(b.downloads) - getNumericDownloads(a.downloads));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    setFilteredApps(result);
    setCurrentPage(1); // Back to page 1
  }, [allApps, searchQuery, selectedGenre, appType, selectedCollection, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setAppType('All');
    setSelectedCollection('All');
    setSortBy('popular');
  };

  // Pagination parameters
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      const resultsSection = document.getElementById('browse-results-anchor');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />

      {/* 🔮 Design 2 Top Header Cover Banner with Floating Effect */}
      <section className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white py-14 px-6 relative overflow-hidden shadow-md">
        {/* Floating gradient visual elements */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-500/15 rounded-full blur-[100px] pointer-events-none translate-x-1/4 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-[11px] font-extrabold uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Download Free Apps & Games
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight max-w-2xl mb-4">
            Exploring your favorite <span className="text-lite">APK</span> Games & Apps
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-xl font-medium leading-relaxed mb-6">
            Search, filter, and download your favorite verified premium applications and games for Android quickly and easily from our fast servers.
          </p>

          <div className="text-xs text-slate-400 font-bold flex items-center gap-2">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:underline hover:text-white transition-colors">Home</span>
            <span>&gt;</span>
            <span className="text-lite">Browse Apps & Games</span>
          </div>
        </div>
      </section>

      {/* 🔍 Advanced Filter Control Dashboard Panel */}
      <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 mt-8">
        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 sm:p-8 border border-gray-150-v shadow-xl shadow-slate-100 relative">
          <div className="flex items-center gap-2.5 mb-6">
            <SlidersHorizontal className="text-lite w-5 h-5" />
            <span className="text-[12px] font-black uppercase text-gray-400 tracking-wider">Advanced Search Engine</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            
            {/* Real Search bar inside */}
            <div className="col-span-1 md:col-span-12 relative mb-2">
              <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">Universal Search</label>
              <div className="relative flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 focus-within:border-lite focus-within:ring-2 focus-within:ring-emerald-100 rounded-2xl p-1.5 transition-all">
                <SearchIcon size={18} className="text-gray-400 ml-3 mr-2Shrink-0" />
                <input
                  type="text"
                  placeholder="Type App Name, Package ID, Developer, or Keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none font-bold text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 px-1 py-2"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-black text-gray-400 hover:text-lite px-3"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Select 1: Genre / Tag */}
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">Genre Category</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-lite cursor-pointer"
              >
                <option value="All">All Genres</option>
                {availableGenres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Select 2: App Type */}
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">App Type</label>
              <select
                value={appType}
                onChange={(e) => setAppType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-lite cursor-pointer"
              >
                <option value="All">All Types (Apps & Games)</option>
                <option value="apps">Apps Only</option>
                <option value="games">Games Only</option>
              </select>
            </div>

            {/* Select 3: Target Collections */}
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">Specific Collection</label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-lite cursor-pointer"
              >
                <option value="All">All Shared Collections</option>
                <option value="latestUpdates">Latest Updates</option>
                <option value="newReleases">New Releases</option>
                <option value="mmorpgApps">MMORPG/Retro Picks</option>
                <option value="topDownloads">Top Importers</option>
                <option value="heroBanners">Hero Specials</option>
              </select>
            </div>

            {/* Select 4: Sorting Sort By */}
            <div className="col-span-1 md:col-span-3">
              <label className="block text-[11px] font-black uppercase text-gray-400 mb-1.5 ml-1">Sort Results By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-800 dark:text-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-lite cursor-pointer"
              >
                <option value="popular">Popularity (Downloads)</option>
                <option value="rating">Top Rated (Stars)</option>
                <option value="name">Alphabetical (A - Z)</option>
              </select>
            </div>

          </div>

          {/* Action trigger row */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800 mt-6 pt-5">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-extrabold text-gray-500 hover:text-lite hover:border-lite transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            >
              <RefreshCw size={14} /> Clear Filters
            </button>

            <div className="text-[11px] text-gray-400 font-extrabold tracking-wider uppercase">
              Filtered <span className="text-lite">{filteredApps.length}</span> matching entries
            </div>
          </div>
        </div>
      </section>

      {/* Custom HTML Ad Segment */}
      {storeState.siteSettings?.adPlacements?.browsePage && (
        <section className="max-w-7xl mx-auto w-full px-5 sm:px-8 mt-6">
          <div 
             className="w-full flex flex-col items-center justify-center overflow-hidden h-[200px]" 
             dangerouslySetInnerHTML={{ __html: storeState.siteSettings.adPlacements.browsePage }} 
          />
        </section>
      )}

      {/* 👑 Featured Discoveries Slider Section */}
      {featuredDocs.length > 0 && selectedGenre === 'All' && searchQuery === '' && (
        <section className="bg-white dark:bg-slate-950 py-8 border-b border-gray-100 dark:border-slate-800 mt-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 shadow-sm">
                <Crown size={18} className="text-amber-500 fill-amber-500" />
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100 tracking-tight leading-none">Featured Discoveries</h3>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 pt-1 hide-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
              {featuredDocs.map((app) => (
                <div 
                  key={app.id}
                  onClick={() => navigate(`/app/${app.id}`)}
                  className="w-[140px] sm:w-[150px] bg-slate-50 dark:bg-slate-900 hover:bg-white dark:bg-slate-950 rounded-3xl p-2.5 border border-gray-150/50 hover:border-lite transition-all shrink-0 cursor-pointer text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-950 p-1 shadow-inner border border-gray-100 dark:border-slate-800 mx-auto mb-2 overflow-hidden group-hover:border-lite/40 transition-colors">
                    <img src={app.icon} className="w-full h-full object-contain rounded-xl" referrerPolicy="no-referrer" alt={app.title} />
                  </div>
                  <h4 className="font-extrabold text-[11px] leading-tight text-gray-900 dark:text-gray-100 group-hover:text-lite transition-colors truncate mb-1">
                    {app.title}
                  </h4>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-lite font-bold">
                    <span>★ {app.rating || '4.5'}</span>
                    <span className="text-[9px] text-gray-400 font-medium">({app.downloads})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 📋 Results Showcase Section */}
      <section id="browse-results-anchor" className="max-w-7xl mx-auto w-full px-5 sm:px-8 py-8 flex-1">
        
        {/* Toggle List/Grid & Header bar */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-gray-200 dark:border-slate-700/60">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
              All Results
              <span className="text-[10px] font-black bg-gray-250 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md uppercase">
                {filteredApps.length} found
              </span>
            </h3>
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-xl p-1 flex items-center shadow-inner shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-lite text-white shadow-sm' 
                  : 'text-gray-400 hover:text-lite'
              }`}
              title="Grid Layout"
            >
              <LayoutGrid size={15} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-lite text-white shadow-sm' 
                  : 'text-gray-400 hover:text-lite'
              }`}
              title="List Layout"
            >
              <List size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Empty filtration State */}
        {currentItems.length === 0 && (
          <div className="bg-white dark:bg-slate-950 border border-gray-150 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto my-6">
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={20} />
            </div>
            <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200 tracking-tight">No Items Coincide</h4>
            <p className="text-slate-400 text-xs mt-2 font-medium max-w-[340px] mx-auto leading-relaxed">
              We couldn't locate any dynamic items for details of query "{searchQuery}" matching type/genres options selected.
            </p>
            <button 
              onClick={handleClearFilters}
              className="mt-6 bg-lite text-white text-xs font-black px-6 py-3 rounded-full hover:bg-opacity-95 transition-all shadow-md active:scale-95 uppercase tracking-wide"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Grid System */}
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

        {/* List Row System */}
        {viewMode === 'list' && currentItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {currentItems.map((app) => (
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
                    v{app.version || '5.1'} &bull; {app.size || '32M'}
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
            ))}
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                currentPage === 1
                  ? 'border-gray-100 dark:border-slate-800 text-gray-300 cursor-not-allowed bg-gray-50 dark:bg-slate-900/50'
                  : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-lite hover:text-lite'
              } bg-white dark:bg-slate-950 hover:shadow-sm`}
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
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
                        : 'bg-white dark:bg-slate-950 text-gray-600 dark:text-gray-400 border-gray-250 hover:border-lite hover:text-lite'
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
