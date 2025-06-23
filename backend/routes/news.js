const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/auth');

// Rotas protegidas por autenticação
router.post('/verify', authMiddleware, newsController.verifyNews);

module.exports = router;