import express from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All upload routes require authentication
router.use(protect);

router.post('/image', uploadImage);
router.delete('/image/:filename', deleteImage);

export default router;
