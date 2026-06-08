import { useEffect } from 'react';

export function useSEO({
  title,
  description,
  keywords,
  image,
  type = "website"
}: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
}) {
  useEffect(() => {
    document.title = title;

    const setMetaTag = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description);
    
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    }

    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', type);
    
    if (image) {
      setMetaTag('property', 'og:image', image);
      setMetaTag('name', 'twitter:image', image);
    }
    
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);

  }, [title, description, keywords, image, type]);
}
