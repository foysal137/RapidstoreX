import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getStoreState } from '../data';
import { ChevronRight } from 'lucide-react';
import { LiteCollectionGrid } from '../components/StoreUI';

export default function AllCollections() {
  const navigate = useNavigate();
  const [storeState] = useState(getStoreState());
  
  const allApps = [
    ...(storeState.heroBanners || []),
    ...(storeState.mmorpgApps || []),
    ...(storeState.latestUpdates || []),
    ...(storeState.newReleases || []),
    ...(storeState.worldCupApps || []),
    ...(storeState.topDownloads || [])
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
      <TopBar />
      
      <main className="max-w-md mx-auto pt-2 pb-20">
        <div className="pt-3 pb-2">
          {/* Breadcrumb */}
          <div className="px-5 flex items-center text-[12.5px] font-medium text-gray-400 gap-2 mb-5">
             <span onClick={() => navigate('/')} className="text-[#65b741] cursor-pointer hover:underline tracking-wide">Home</span>
             <ChevronRight className="w-[14px] h-[14px]" />
             <span className="text-[#f08c00] font-bold tracking-wide">Collection</span>
          </div>

          <div className="px-5 mb-6">
             <h1 className="text-[26px] font-black text-gray-900 dark:text-gray-100 tracking-tight flex items-baseline gap-2">
                 Collection 
             </h1>
          </div>

          {/* App Grid */}
          <LiteCollectionGrid collections={storeState.mustHaveCollections || []} apps={allApps} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
