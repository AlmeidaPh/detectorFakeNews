const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    check('name', 'Nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor inclua um email válido').isEmail(),
    check('username', 'Nome de usuário deve ter entre 4 e 20 caracteres').isLength({ min: 4, max: 20 }),
    check('password', 'Por favor insira uma senha com 8 ou mais caracteres').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, username, password } = req.body;

    try {
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Usuário já existe' }] });
      }

      user = new User({ name, email, username, password });
      await user.save();

      const payload = { user: { id: user.id } };
      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '5d' },
          (err, token) => {
              if (err) throw err;
              res.json({ 
                  token,
                  user: {
                      id: user.id,
                      username: user.username,
                      name: user.name,
                      email: user.email
                  }
              });
          }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    check('emailOrUsername', 'Por favor insira um email ou nome de usuário').not().isEmpty(),
    check('password', 'Senha é obrigatória').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emailOrUsername, password } = req.body;

    try {
      let user = await User.findOne({
        $or: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }).select('+password');

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas' }] });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Credenciais inválidas' }] });
      }

      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

module.exports = router;