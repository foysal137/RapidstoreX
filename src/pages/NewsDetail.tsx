import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar, Footer } from '../components/Shared';
import { getStoreState } from '../data';
import { useSEO } from '../hooks/useSEO';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const store = getStoreState();
    const item = (store.news || []).find((n: any) => n.id === id);
    if (item) {
      setNewsItem(item);
    }
  }, [id]);

  useSEO({
    title: newsItem ? `${newsItem.title} - RapidAPK News` : 'Loading... - RapidAPK',
    description: newsItem ? newsItem.content.substring(0, 150) : '',
    type: 'article',
    image: newsItem?.thumbnail
  });

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

  if (!newsItem) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900">
        <TopBar showBack />
        <div className="flex-1 flex items-center justify-center">
           <div className="text-gray-500 font-bold bg-white dark:bg-slate-950 px-6 py-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">News article not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 pb-safe animate-in fade-in duration-300">
      <TopBar showBack />

      <main className="flex-1 max-w-4xl mx-auto w-full md:py-8 lg:py-12 md:px-6 z-10">
        <article className="bg-white dark:bg-slate-950 md:rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-x md:border border-gray-100 dark:border-slate-800">
          
          {newsItem.thumbnail && (
            <div className="w-full relative aspect-video bg-gray-100">
              <img src={newsItem.thumbnail} alt={newsItem.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-[#8cc63f] text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider">
                {newsItem.category || "News"}
              </span>
              <span className="text-sm font-bold text-gray-400">
                {newsItem.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100 leading-tight">
              {newsItem.title}
            </h1>
            
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider pb-6 border-b border-gray-100 dark:border-slate-800">
               <span>{newsItem.readTime || "1 minute read"}</span>
               <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
               <span>{newsItem.views || "1.2K views"}</span>
            </div>

            <div 
              className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed prose prose-headings:font-black prose-a:text-blue-500 prose-img:rounded-3xl max-w-none pt-4"
              dangerouslySetInnerHTML={{ __html: parseBBCode(newsItem.content) }}
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
