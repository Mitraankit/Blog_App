import Gallery from '../models/gallery.model.js';
import { errorHandler } from '../utils/error.js';

export const addPhoto = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to add photos'));
  }
  const { image } = req.body;
  if (!image) {
    return next(errorHandler(400, 'Image URL is required'));
  }
  try {
    const photo = new Gallery({ image, userId: req.user.id });
    const saved = await photo.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

export const getPhotos = async (req, res, next) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    next(error);
  }
};

export const deletePhoto = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete photos'));
  }
  try {
    await Gallery.findByIdAndDelete(req.params.photoId);
    res.status(200).json('Photo deleted');
  } catch (error) {
    next(error);
  }
};
