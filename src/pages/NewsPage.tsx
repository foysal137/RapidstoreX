import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getStoreState } from '../data';
import { LiteNewsSection } from '../components/StoreUI';
import { useSEO } from '../hooks/useSEO';

export default function NewsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useSEO({
    title: "Android App News & Guides - RapidAPK",
    description: "Stay updated with the latest news, guides, and updates for Android applications and games on RapidAPK.",
    keywords: "android news, apk updates, app guides, android, apk",
    type: "website"
  });

  const news = getStoreState().news || [];
  
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />
      
      {/* Hero Header Banner */}
      <div className="bg-[#1e293b] text-white py-12 px-6 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-3">
              Latest <span className="text-lite">News</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-[480px] leading-relaxed font-medium">
              Stay updated with the latest news, guides, and updates for Android applications and games.
            </p>
          </div>
          
          <div className="w-full md:w-96">
            <div className="relative bg-white/10 dark:bg-slate-950/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/15 shadow-2xl flex items-center">
              <input
                type="text"
                placeholder="Search news & guides..."
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

      <section className="max-w-3xl mx-auto w-full py-8 flex-1">
        {filteredNews.length > 0 ? (
          <LiteNewsSection items={filteredNews} />
        ) : (
          <p className="text-gray-500 text-center py-12 font-bold bg-white dark:bg-slate-950 mx-4 rounded-3xl border border-gray-100 dark:border-slate-800 italic">No news found matching your search.</p>
        )}
      </section>

      <Footer />
    </div>
  );
}
