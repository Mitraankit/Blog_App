import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  create, deletepost, getposts, updatepost,
  incrementView, likePost, bookmarkPost, getPostsForMonth, reactToPost, getCategories,
} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);
router.put('/view/:postId', incrementView);
router.put('/like/:postId', verifyToken, likePost);
router.put('/bookmark/:postId', verifyToken, bookmarkPost);
router.get('/monthly', getPostsForMonth);
router.get('/categories', getCategories);
router.put('/react/:postId', verifyToken, reactToPost);

export default router;
