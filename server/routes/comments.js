import express from 'express';
import {
  getCommentsByPost,
  addComment,
  updateComment,
  deleteComment,
  approveComment
} from '../controllers/comments.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(addComment); // Public endpoint for both authenticated and guest users

router.route('/post/:postId')
  .get(getCommentsByPost);

router.route('/:id')
  .put(protect, updateComment)
  .delete(protect, deleteComment);

router.route('/:id/approve')
  .put(protect, authorize('admin'), approveComment);

export default router;
