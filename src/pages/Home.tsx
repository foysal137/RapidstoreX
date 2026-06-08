import { useEffect } from 'react';
import { TopBar, Footer } from '../components/Shared';
import { 
  SectionHeader, 
  LiteHeroCarousel, 
  LiteCollectionGrid, 
  LiteVerticalAppList,
  LiteNewsSection 
} from '../components/StoreUI';
import { getStoreState } from '../data';
import { Flame, Puzzle, Gamepad2, LayoutGrid, Newspaper } from 'lucide-react';

export default function Home() {
  const { 
    heroBanners = [], 
    latestUpdates = [], 
    newReleases = [], 
    topDownloads = [],
    paidForYou = [],
    news = [],
    headerTags = [],
    siteSettings = {} as any
  } = getStoreState();

  useEffect(() => {
    document.title = `${siteSettings.title} - Download Free Android Apps and Games`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", siteSettings.description || "Download free Android apps and games quickly and safely.");
    
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "RapidAPK, apk download, android apps, android games, free apk");
  }, [siteSettings]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <TopBar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto">

        {/* Custom Multiple Ads Zone */}
        {siteSettings.customAds && siteSettings.customAds.length > 0 && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-4 space-y-4">
            {siteSettings.customAds.filter(ad => ad.active).map((ad, i) => (
              <a 
                key={ad.id}
                href={ad.link || '#'}
                className="block w-full overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950 p-2 hover:shadow-xl transition-all"
              >
                <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto rounded-xl object-cover" />
              </a>
            ))}
          </div>
        )}
        
        {/* Section 1: Hero Carousel (Indispensable on your phone) */}
        <SectionHeader title="Indispensable on your phone" icon={Flame} />
        <LiteHeroCarousel items={heroBanners} />

        {/* Section 2: Collections (Must have collection) */}
        <SectionHeader title="Must have collection" actionPath="/collections" icon={Puzzle} />
        <LiteCollectionGrid collections={getStoreState().mustHaveCollections} apps={latestUpdates} limit={4} />

        {/* Section 3: Latest Games (Vertical list) */}
        <SectionHeader title="Lastest Games" actionPath="/games" icon={Gamepad2} />
        <LiteVerticalAppList items={newReleases.slice(0, 8)} modTextPrefix="Unlocked Game" />

        {/* Section 4: Latest Apps (Vertical list) */}
        <SectionHeader title="Lastest Apps" actionPath="/apps" icon={LayoutGrid} />
        <LiteVerticalAppList items={latestUpdates.slice(0, 8)} modTextPrefix="Premium Unlocked" />

        {/* Section: Paid for you */}
        {paidForYou.length > 0 && (
          <>
            <SectionHeader title="Paid for you" actionPath="/browse" icon={Flame} />
            <LiteVerticalAppList items={paidForYou.slice(0, 8)} modTextPrefix="Full Game" />
          </>
        )}

        {/* Section 5: News Section */}
        {getStoreState().news && getStoreState().news.length > 0 && (
          <>
            <SectionHeader title="News" actionPath="/news" icon={Newspaper} />
            <LiteNewsSection items={getStoreState().news} />
          </>
        )}

      </main>

      <div className="pb-12">
        <Footer />
      </div>
    </div>
  );
}
