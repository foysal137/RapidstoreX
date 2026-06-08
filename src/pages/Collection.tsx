import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getStoreState } from '../data';
import { ChevronRight, Grid2X2, List } from 'lucide-react';
import { LiteAppCard } from '../components/StoreUI';

export default function Collection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [storeState] = useState(getStoreState());
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');
  
  const collection = storeState.mustHaveCollections?.find(c => c.id === id);
  // Find all apps matching this collection Id from all sections
  const allApps = [
    ...storeState.heroBanners,
    ...storeState.mmorpgApps,
    ...storeState.latestUpdates,
    ...storeState.newReleases,
    ...storeState.worldCupApps,
    ...storeState.topDownloads
  ];
  
  const collectionApps = allApps.filter(app => app.collectionId === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!collection) {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <TopBar />
            <div className="p-20 text-center font-bold text-gray-400 mt-10">Collection not found</div>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <TopBar />
      
      <main className="max-w-md mx-auto pt-2 pb-20">
        <div className="px-5 pt-3 pb-2">
          {/* Breadcrumb */}
          <div className="flex items-center text-[12.5px] font-medium text-gray-400 gap-2 mb-5">
             <span onClick={() => navigate('/')} className="text-[#65b741] cursor-pointer hover:underline tracking-wide">Home</span>
             <ChevronRight className="w-[14px] h-[14px]" />
             <span onClick={() => navigate('/collections')} className="text-[#65b741] cursor-pointer hover:underline tracking-wide">Collection</span>
             <ChevronRight className="w-[14px] h-[14px]" />
             <span className="text-[#f08c00] font-bold tracking-wide">{collection.title}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col mb-6">
             <div className="flex items-center justify-between mb-4">
                 <h1 className="text-[26px] font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-baseline gap-2">
                     {collection.title} 
                     <span className="text-gray-400 text-lg font-bold">({collectionApps.length})</span>
                 </h1>
                 <div className="border border-[#65b741] text-[#65b741] rounded-[0.5rem] px-3 py-[0.35rem] text-[13px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform bg-white dark:bg-slate-950 shadow-sm">
                    Newest <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                 </div>
             </div>
             
             <p className="text-gray-600 dark:text-gray-400 text-[14px] leading-relaxed mb-6 border-b border-gray-100 dark:border-slate-800 pb-6 whitespace-pre-line">
                 {collection.description || 'Step beyond limits — precision, power, and raw instinct collide in every fight.'}
             </p>

             {/* Controls */}
             <div className="flex items-center gap-2 mb-2">
                 <div className="bg-[#f8f9fa] border border-gray-100 dark:border-slate-800 rounded-2xl p-[5px] flex shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                     <button 
                         onClick={() => setViewMode('grid')}
                         className={`rounded-[10px] p-[8px] transition-all duration-200 ${viewMode === 'grid' ? 'bg-white dark:bg-slate-950 text-[#65b741] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                     >
                        <Grid2X2 className="w-5 h-5" />
                     </button>
                     <button 
                         onClick={() => setViewMode('list')}
                         className={`rounded-[10px] p-[8px] transition-all duration-200 ${viewMode === 'list' ? 'bg-white dark:bg-slate-950 text-[#65b741] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                     >
                        <List className="w-5 h-5" />
                     </button>
                 </div>
             </div>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
             {collectionApps.length > 0 ? (
                 collectionApps.map(app => (
                    <LiteAppCard key={app.id} item={app} />
                 ))
             ) : (
                 <div className="col-span-2 py-12 text-center border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-3xl">
                     <p className="text-gray-400 font-bold text-sm">No apps found in this collection.</p>
                 </div>
             )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
