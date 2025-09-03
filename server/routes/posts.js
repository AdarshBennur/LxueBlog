import express from 'express';
import {
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} from '../controllers/posts.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, authorize('user', 'author', 'admin'), createPost);

router.route('/slug/:slug')
  .get(getPostBySlug);

router.route('/user/:userId')
  .get(protect, getUserPosts);

router.route('/:id')
  .get(getPost)
  .put(protect, authorize('user', 'author', 'admin'), updatePost)
  .delete(protect, authorize('user', 'author', 'admin'), deletePost);

export default router;
