import { ChevronRight, Star, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStoreState } from '../data';

export function NavigationTabs({ tags = [] }: { tags?: string[] }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-950 overflow-x-auto hide-scrollbar border-b border-gray-100 dark:border-slate-800 dark:border-slate-800 flex items-center gap-6 px-6 py-4">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => navigate(`/category/${tag.toLowerCase()}`)}
          className="whitespace-nowrap text-[15px] font-black uppercase text-gray-800 dark:text-gray-200 hover:text-lite transition-colors tracking-tighter"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export function SectionHeader({ title, tag, icon: Icon, actionPath }: { title: string, tag?: string, icon?: any, actionPath?: string }) {
  const navigate = useNavigate();
  const handleNavigation = () => {
    if (actionPath) {
      navigate(actionPath);
    } else if (tag) {
      navigate(`/category/${tag.toLowerCase()}`);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 md:px-0 py-5 mt-2">
      <div 
        onClick={handleNavigation}
        className={`flex items-center gap-2 md:gap-3 ${actionPath || tag ? 'cursor-pointer group' : ''}`}
      >
        {Icon && <Icon className="text-[#db7f36] w-5 h-5 stroke-[2.5] group-hover:scale-110 transition-transform" />}
        <h2 className="text-[18px] md:text-[20px] font-bold text-gray-800 dark:text-gray-200 tracking-tight leading-none group-hover:text-lite transition-colors">{title}</h2>
      </div>
      {(tag || actionPath) && (
        <button
          onClick={handleNavigation}
          className="text-[13px] md:text-[15px] font-medium text-[#8cc63f] hover:underline cursor-pointer"
        >
          More
        </button>
      )}
    </div>
  );
}

export function getAppTags(item: any): string[] {
  if (item && item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
    return item.tags.slice(0, 3);
  }
  const tags: string[] = [];
  if (item.editorsChoice) tags.push("Editor's Choice");
  if (item.isOffline) tags.push("Offline");
  
  if (tags.length === 0 && item.tag && item.tag !== "Premium" && item.tag !== "Premium Unlocked") {
    tags.push(item.tag);
  }
  return tags.slice(0, 3);
}

export function LiteHeroCarousel({ items = [] }: { items?: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="flex overflow-x-auto hide-scrollbar px-6 md:px-0 gap-4 pb-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          onClick={() => navigate(`/app/${item.id}`)} 
          className="shrink-0 w-[85vw] md:w-[31%] max-w-[340px] md:max-w-none relative rounded-[20px] overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-sm group"
        >
          {/* Main Banner Container */}
          <div className="w-full aspect-[2/1] md:aspect-[21/10] relative bg-slate-100 dark:bg-slate-900">
             <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
             
             {/* Subtitle text floating top right - removed as per image 1 */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
             
             {/* Simple App info floating at bottom left */}
             <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 flex items-center gap-2.5 z-10">
                 <div className="w-10 h-10 md:w-11 md:h-11 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl md:rounded-2xl shrink-0 shadow-sm overflow-hidden flex items-center justify-center p-0.5 border border-white/20">
                    <img src={item.icon || item.image} className="w-full h-full object-cover rounded-[10px] md:rounded-xl" />
                 </div>
                 <div className="flex flex-col drop-shadow-md pb-0.5">
                    <h4 className="text-white font-bold text-sm md:text-[15px] leading-tight text-shadow-sm">{item.title}</h4>
                    <p className="text-white/90 text-[10px] md:text-[11px] font-medium tracking-wide mt-0.5 text-shadow-sm">{item.tag || 'Application'}</p>
                 </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LiteCollectionGrid({ collections = [], apps = [], limit }: { collections?: any[], apps?: any[], limit?: number }) {
  const navigate = useNavigate();
  // Filter active collections
  const activeCollections = collections.filter(c => c.active !== false);
  const displayCollections = limit ? activeCollections.slice(0, limit) : activeCollections;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-6 md:px-0 pb-4">
      {displayCollections.map((collection) => {
        const collectionApps = apps.filter(app => app.collectionId === collection.id);
        const topApps = collectionApps.slice(0, 3); // Changed to 3
        const extraCount = Math.max(0, collectionApps.length - 3);

        return (
          <div 
            key={collection.id} 
            onClick={() => navigate(`/collection/${collection.id}`)} 
            className="relative rounded-[20px] overflow-hidden aspect-[4/4.5] cursor-pointer active:scale-[0.98] transition-transform group shadow-sm bg-gray-100 dark:bg-slate-900"
          >
            <img src={collection.image} alt={collection.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/10" />
            
            <div className="relative z-10 flex flex-col justify-end p-4 md:p-5 gap-3 h-full">
               <h3 
                 onClick={(e) => { e.stopPropagation(); navigate(`/collection/${collection.id}`); }}
                 className="text-white font-black text-sm md:text-[15px] tracking-tight leading-tight px-1 hover:underline cursor-pointer w-fit drop-shadow-sm"
               >
                  {collection.title}
               </h3>
               <div className="flex items-center -space-x-2 px-1">
                  {topApps.map((app, i) => (
                    <div 
                       key={app.id || i} 
                       onClick={(e) => { e.stopPropagation(); navigate(`/app/${app.id}`); }}
                       className="w-10 h-10 md:w-11 md:h-11 rounded-[14px] bg-black/20 backdrop-blur-sm border-2 border-white/80 p-0.5 flex items-center justify-center shadow-sm shrink-0 hover:scale-110 transition-transform cursor-pointer relative z-20"
                       style={{ zIndex: 10 - i }}
                    >
                      <img 
                         src={app.icon} 
                         className="w-full h-full object-cover rounded-[10px]" 
                      />
                    </div>
                  ))}
                  {extraCount > 0 && (
                     <div className="w-10 h-10 md:w-11 md:h-11 rounded-[14px] bg-black/60 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center shadow-sm shrink-0 select-none relative" style={{ zIndex: 0 }}>
                       <span className="text-white font-black text-[10px] md:text-xs">+{extraCount}</span>
                     </div>
                  )}
                  {collectionApps.length === 0 && (
                     <div className="text-white/60 text-[10px] italic z-0 pl-3">No apps yet</div>
                  )}
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LiteAppCard({ item }: { item: any; key?: any }) {
  const navigate = useNavigate();
  
  const size = item.size || 'Varies';
  const tags = getAppTags(item);

  return (
    <div 
      onClick={() => navigate(`/app/${item.id}`)}
      className="bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] cursor-pointer active:scale-95 transition-transform"
    >
      <div className="bg-[#f8f9fa] dark:bg-slate-800 rounded-xl relative p-3 flex items-center justify-center aspect-square border border-gray-100 dark:border-slate-800 dark:border-slate-700 overflow-hidden group">
         {/* Badges Overlay */}
         <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 w-[95%]">
             {tags.map((tag, idx) => {
                 const bgColors = [
                   'bg-orange-500',
                   'bg-emerald-600',
                   'bg-indigo-600'
                 ];
                 const bgColor = bgColors[idx % bgColors.length];
                 return (
                   <span key={tag} className={`${bgColor} text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase shadow-sm tracking-wider`}>
                     {tag}
                   </span>
                 );
             })}
         </div>
         <img src={item.icon || item.image} alt={item.title} className="w-[78%] h-[78%] object-cover rounded-xl shadow-sm transform group-hover:scale-105 transition-transform duration-500 mt-4" referrerPolicy="no-referrer" />
      </div>
      
      <div className="px-1 space-y-1.5 pb-1">
         <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[14px] leading-tight line-clamp-1">{item.title}</h3>
         <p className="text-gray-400 dark:text-gray-500 text-[11px] font-medium tracking-wide">v{item.version || '1.0.0'} &bull; {size}</p>
         <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center gap-0.5">
               <Star className="w-[12px] h-[12px] fill-orange-400 text-orange-400" />
               <span className="text-orange-500 text-[11px] font-bold">{item.rating || '4.0'}</span>
            </div>
            <span className="text-gray-400 text-[11px] truncate flex-1">{item.subtitle || 'Official App'}</span>
         </div>
      </div>
    </div>
  );
}

export function LiteVerticalAppList({ items = [], modTextPrefix = "Unlocked" }: { items?: any[], modTextPrefix?: string }) {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-0 space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-3 lg:gap-4 pb-6">
      {items.map((item) => {
        const itemTags = getAppTags(item);
        const tagText = item.tag || item.subtitle || 'Premium Unlocked';
        
        return (
          <div 
            key={item.id} 
            onClick={() => navigate(`/app/${item.id}`)} 
            className="bg-white dark:bg-slate-950 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:shadow-inner active:scale-[0.99] transition-all cursor-pointer group hover:border-lite"
          >
            <div className="w-[52px] h-[52px] md:w-14 md:h-14 bg-[#f8f9fa] rounded-[14px] p-[2px] shrink-0 border border-gray-100 dark:border-slate-800 group-hover:border-lite/30 transition-colors relative">
               {/* Tiny MOD/Premium Tag */}
               {item.hasMod || tagText.toLowerCase().includes('unlocked') ? (
                 <span className="absolute -top-1 -left-1 text-[6px] font-black tracking-wide uppercase bg-[#db7f36] text-white px-1 py-[1px] rounded-sm leading-none z-10">
                   MOD
                 </span>
               ) : null}
               <img src={item.icon || item.image} alt={item.title} className="w-full h-full object-contain rounded-xl bg-white dark:bg-slate-950" />
            </div>
            
            <div className="flex-1 min-w-0 pr-1">
               <h4 className="text-[13px] md:text-[14px] font-bold text-gray-900 dark:text-gray-100 group-hover:text-lite transition-colors truncate">
                 {item.title}
               </h4>
               <div className="flex items-center gap-1 mt-[1px]">
                  <span className="text-[10px] md:text-[11px] text-gray-500 font-bold">{item.rating || '4.2'}</span>
                  <Star size={8} className="fill-[#db7f36] text-[#db7f36]" />
                  <span className="w-[3px] h-[3px] rounded-full bg-gray-300 mx-0.5" />
                  <span className="text-[10px] md:text-[11px] text-gray-400 font-semibold truncate">{item.subtitle || 'Action'}</span>
               </div>
               <div className="mt-0.5">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#db7f36] truncate block">
                    {tagText}
                  </span>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LiteNewsSection({ items = [] }: { items?: any[] }) {
  const navigate = useNavigate();
  
  const parseBBCode = (text: string) => {
    if (!text) return "";
    let html = text
      .replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>")
      .replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>")
      .replace(/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>")
      .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, "<a href='$1' class='text-blue-500 underline' target='_blank' rel='noopener noreferrer'>$2</a>")
      .replace(/\[img\](.*?)\[\/img\]/gi, "<img src='$1' alt='Image' class='w-full rounded-2xl my-3 border border-slate-100 dark:border-slate-800 shadow-sm' />")
      .replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, "<span style='color:$1'>$2</span>")
      .replace(/\[size=(.*?)\](.*?)\[\/size\]/gi, "<span style='font-size:$1px'>$2</span>")
      .replace(/\n/g, "<br/>");
    return html;
  };

  return (
    <div className="px-5 md:px-0 space-y-5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 pb-20">
      {items.slice(0, 10).map((item, index) => {
        const isRealNews = !!item.content;
        if (!isRealNews) return null; // Remove fake "mod properly" articles.

        const thumbnailSrc = item.thumbnail || item.image;
        const categoryBadge = item.category || "News";
        const readTime = item.readTime || "1 minute read";
        const viewsCount = item.views || "29.2K views";
        const dateStr = item.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const titleStr = item.title;

        return (
          <div key={item.id || index} onClick={() => isRealNews ? navigate(`/news/${item.id}`) : navigate(`/app/${item.id}`)} className="bg-white dark:bg-slate-950 rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-slate-800 flex flex-col cursor-pointer hover:shadow-md transition-shadow">
             {thumbnailSrc && (
               <div className="w-full relative aspect-[16/9] md:aspect-video rounded-t-[24px] overflow-hidden shrink-0">
                  <img src={thumbnailSrc} alt="news" className="w-full h-full object-cover" />
               </div>
             )}
             
             <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3 shrink-0">
                  <span className="bg-[#8cc63f] text-white text-[11px] font-bold px-3 py-1 rounded-[10px]">
                     {categoryBadge}
                  </span>
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                     {dateStr}
                  </span>
                </div>
                
                <h3 className="text-[19px] sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-2.5 line-clamp-2 shrink-0">
                   {titleStr}
                </h3>
                
                <div 
                  className="text-[14px] sm:text-[15px] text-gray-700 dark:text-gray-300 font-normal leading-snug line-clamp-2 md:line-clamp-3 mb-4"
                  dangerouslySetInnerHTML={{ __html: item.content.replace(/\[img\].*?\[\/img\]/gi, "").replace(/\[.*?\]/g, "") }}
                />
                
                <div className="mt-auto flex items-center gap-2.5 text-[13px] text-gray-800 dark:text-gray-200 font-medium pt-1">
                   <span>{readTime}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-800 shrink-0" />
                   <span className="truncate">{viewsCount}</span>
                </div>
             </div>
          </div>
        );
      })}
    </div>
  );
}
