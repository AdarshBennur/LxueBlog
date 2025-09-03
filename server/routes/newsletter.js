import express from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers
} from '../controllers/newsletter.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.put('/unsubscribe', unsubscribe);
router.get('/', protect, authorize('admin'), getSubscribers);

export default router;
