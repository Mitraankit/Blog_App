import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
    tags: req.body.tags || [],
    status: req.body.status || 'published',
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;

    const filter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.tag && { tags: req.query.tag }),
      ...(req.query.status === 'all' ? {} : { status: req.query.status || 'published' }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    const [posts, totalPosts, filteredTotal] = await Promise.all([
      Post.find(filter).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments(filter),
    ]);

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      status: 'published',
    });

    res.status(200).json({ posts, totalPosts, filteredTotal, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
          tags: req.body.tags || [],
          status: req.body.status || 'published',
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const incrementView = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { views: 1 } });
    res.status(200).json('View counted');
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, 'Unauthorized'));
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found'));
    const alreadyLiked = post.likes.includes(req.user.id);
    const updated = await Post.findByIdAndUpdate(
      req.params.postId,
      alreadyLiked
        ? { $pull: { likes: req.user.id } }
        : { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const bookmarkPost = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, 'Unauthorized'));
  try {
    const user = await User.findById(req.user.id);
    const alreadyBookmarked = user.bookmarks.includes(req.params.postId);
    await User.findByIdAndUpdate(
      req.user.id,
      alreadyBookmarked
        ? { $pull: { bookmarks: req.params.postId } }
        : { $addToSet: { bookmarks: req.params.postId } }
    );
    res.status(200).json({ bookmarked: !alreadyBookmarked });
  } catch (error) {
    next(error);
  }
};

export const reactToPost = async (req, res, next) => {
  if (!req.user) return next(errorHandler(401, 'Unauthorized'));
  const { type } = req.body;
  if (!['fire', 'bulb', 'clap'].includes(type)) return next(errorHandler(400, 'Invalid reaction'));
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, 'Post not found'));
    const alreadyReacted = post.reactions[type].includes(req.user.id);
    const update = alreadyReacted
      ? { $pull: { [`reactions.${type}`]: req.user.id } }
      : { $addToSet: { [`reactions.${type}`]: req.user.id } };
    const updated = await Post.findByIdAndUpdate(req.params.postId, update, { new: true });
    res.status(200).json(updated.reactions);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Post.distinct('category', { status: 'published', category: { $ne: '' } });
    res.status(200).json(categories.sort());
  } catch (error) {
    next(error);
  }
};

export const getPostsForMonth = async (req, res, next) => {
  try {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await Post.countDocuments({ createdAt: { $gte: start, $lt: end }, status: 'published' });
      months.push({ month: start.toLocaleString('default', { month: 'short' }), count });
    }
    res.status(200).json(months);
  } catch (error) {
    next(error);
  }
};
