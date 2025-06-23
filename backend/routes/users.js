const express = require('express');
const router = express.Router();
const auth = require('/backEnd/middleware/auth.js');
const User = require('/backEnd/models/User.js');

// Rota GET básica para teste
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;