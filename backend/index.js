import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import galleryRoutes from './routes/gallery.route.js';
import projectRoutes from './routes/project.route.js';
import newsletterRoutes from './routes/newsletter.route.js';
import sitemapRoutes from './routes/sitemap.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    if (isDev) console.info('[db] MongoDB connected');
  })
  .catch((err) => {
    console.error('[db] MongoDB connection error:', err.message);
    process.exit(1);
  });

const __dirname = path.resolve();

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // disable CSP — Vite/React inline scripts need it off until you configure it
  crossOriginEmbedderPolicy: false,
}));

// Gzip compression
app.use(compression());

app.use(express.json());
app.use(cookieParser());

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, statusCode: 429, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, statusCode: 429, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (isDev) console.info(`[server] Running on port ${PORT}`);
});

app.use('/api/user', apiLimiter, userRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/post', apiLimiter, postRoutes);
app.use('/api/comment', apiLimiter, commentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/', sitemapRoutes);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (statusCode >= 500) console.error('[error]', err);
  res.status(statusCode).json({ success: false, statusCode, message });
});
