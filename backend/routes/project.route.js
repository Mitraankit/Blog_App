import express from 'express';
import { addProject, getProjects, deleteProject } from '../controllers/project.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', getProjects);
router.post('/add', verifyToken, addProject);
router.delete('/:projectId', verifyToken, deleteProject);

export default router;
