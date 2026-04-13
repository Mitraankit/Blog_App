import express from 'express';
import { addPhoto, getPhotos, deletePhoto } from '../controllers/gallery.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', getPhotos);
router.post('/add', verifyToken, addPhoto);
router.delete('/:photoId', verifyToken, deletePhoto);

export default router;
