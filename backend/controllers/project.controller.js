import Project from '../models/project.model.js';
import { errorHandler } from '../utils/error.js';

export const addProject = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to add projects'));
  }
  const { title, description, image, link } = req.body;
  if (!title || !description || !image || !link) {
    return next(errorHandler(400, 'All fields are required'));
  }
  try {
    const project = new Project({ title, description, image, link, userId: req.user.id });
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to delete projects'));
  }
  try {
    await Project.findByIdAndDelete(req.params.projectId);
    res.status(200).json('Project deleted');
  } catch (error) {
    next(error);
  }
};
