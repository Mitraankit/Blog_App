import express from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletter.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/subscribers', verifyToken, getSubscribers);

export default router;
