import { useEffect } from 'react';

/**
 * Sets <title> and Open Graph / Twitter Card meta tags.
 * Cleans up and resets to defaults on unmount.
 */
export function useSEO({ title, description, image, url } = {}) {
  useEffect(() => {
    const canonical = url || window.location.href;
    const prev = {
      title: document.title,
      ogTitle: getMeta('og:title'),
      ogDesc: getMeta('og:description'),
      ogImage: getMeta('og:image'),
      ogUrl: getMeta('og:url'),
      ogType: getMeta('og:type'),
      twCard: getMeta('twitter:card'),
      twTitle: getMeta('twitter:title'),
      twDesc: getMeta('twitter:description'),
      twImage: getMeta('twitter:image'),
      metaDesc: getMeta('description'),
      canonical: getCanonical(),
    };

    if (title) document.title = title;

    setMeta('og:title', title || '');
    setMeta('og:description', description || '');
    setMeta('og:image', image || '');
    setMeta('og:url', canonical);
    setMeta('og:type', 'article');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title || '');
    setMeta('twitter:description', description || '');
    setMeta('twitter:image', image || '');
    setMeta('description', description || '');
    setCanonical(canonical);

    return () => {
      document.title = prev.title;
      setMeta('og:title', prev.ogTitle);
      setMeta('og:description', prev.ogDesc);
      setMeta('og:image', prev.ogImage);
      setMeta('og:url', prev.ogUrl);
      setMeta('og:type', prev.ogType);
      setMeta('twitter:card', prev.twCard);
      setMeta('twitter:title', prev.twTitle);
      setMeta('twitter:description', prev.twDesc);
      setMeta('twitter:image', prev.twImage);
      setMeta('description', prev.metaDesc);
      setCanonical(prev.canonical);
    };
  }, [title, description, image, url]);
}

function getMeta(name) {
  const el = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
  return el ? el.getAttribute('content') : '';
}

function getCanonical() {
  const el = document.querySelector('link[rel="canonical"]');
  return el ? el.getAttribute('href') : '';
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href || '');
}

function setMeta(name, content) {
  // Try property first (OG), then name
  let el = document.querySelector(`meta[property="${name}"]`);
  if (!el) el = document.querySelector(`meta[name="${name}"]`);

  if (!el) {
    el = document.createElement('meta');
    const isOG = name.startsWith('og:') || name.startsWith('twitter:');
    el.setAttribute(isOG ? 'property' : 'name', name);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content || '');
}
