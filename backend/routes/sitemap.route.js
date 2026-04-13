import express from 'express';
import Post from '../models/post.model.js';

const router = express.Router();

router.get('/sitemap.xml', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' }).select('slug updatedAt');
    const base = process.env.SITE_URL || 'https://versoblog.netlify.app';

    const staticPages = ['', '/about', '/projects', '/gallery', '/search'];

    const staticUrls = staticPages.map((path) => `
  <url>
    <loc>${base}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const postUrls = posts.map((post) => `
  <url>
    <loc>${base}/post/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const base = process.env.SITE_URL || 'https://versoblog.netlify.app';
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/

Sitemap: ${base}/sitemap.xml`);
});

export default router;
