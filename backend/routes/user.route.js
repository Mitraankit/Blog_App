import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  getUserByUsername,
  signout,
  test,
  updateUser,
  updateTheme,
  toggleAdmin,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.put('/theme', verifyToken, updateTheme);
router.put('/toggleadmin/:userId', verifyToken, toggleAdmin);
router.get('/username/:username', getUserByUsername);
router.get('/:userId', getUser);

export default router;
