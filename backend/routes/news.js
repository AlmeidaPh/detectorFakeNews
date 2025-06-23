import express from 'express';
import { verifyNews } from '/backEnd/controllers/newsController.js';
import authMiddleware from '/backEnd/middlewares/auth.js';

const router = express.Router();

router.post('/verify', authMiddleware, verifyNews);

export default router;