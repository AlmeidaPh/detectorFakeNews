import express from 'express';
import { verifyNews } from '../controllers/newsController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/verify', authMiddleware, verifyNews);

export default router;