import express from 'express';
import {
  getTags,
  getTag,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tags.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getTags)
  .post(protect, authorize('admin', 'author'), createTag);

router.route('/slug/:slug')
  .get(getTagBySlug);

router.route('/:id')
  .get(getTag)
  .put(protect, authorize('admin'), updateTag)
  .delete(protect, authorize('admin'), deleteTag);

export default router;
