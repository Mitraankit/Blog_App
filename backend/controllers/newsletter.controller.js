import Newsletter from '../models/newsletter.model.js';
import { errorHandler } from '../utils/error.js';

export const subscribe = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(errorHandler(400, 'Email is required'));
  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(200).json({ message: 'Already subscribed!' });
    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json({ subscribers, total: subscribers.length });
  } catch (error) {
    next(error);
  }
};
